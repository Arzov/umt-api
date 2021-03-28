#!/bin/bash
# ==========================================================
# Run tests locally for AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Parameters
# ----------------------------------------------------------

DYNAMODB_SERVICE_IP=172.17.0.1
DYNAMODB_PORT=8000
DYNAMODB_TEMPLATE_START_LINE=5
DYNAMODB_CONN_TIMEOUT=60000

LAMBDA_SERVICE_IP=0.0.0.0


# ----------------------------------------------------------
#  Create template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh


# ----------------------------------------------------------
#  Start AWS DynamoDB service
# ----------------------------------------------------------

docker run \
    --name arzov-dynamodb \
    -p $DYNAMODB_PORT:$DYNAMODB_PORT \
    -d \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar \
    -inMemory -sharedDb

# Create tables
cd dynamodb/tables

declare -A tables=(
  [umt-001]=$DYNAMODB_TEMPLATE_START_LINE
)

for table in "${!tables[@]}"
do
    ln="${tables[$table]}"
    cd $table
    awk "NR >= ${ln}" resource.yml > tmp.yml
    aws dynamodb create-table \
        --cli-input-yaml file://tmp.yml \
        --endpoint-url http://$DYNAMODB_SERVICE_IP:$DYNAMODB_PORT \
        --cli-connect-timeout $DYNAMODB_CONN_TIMEOUT \
        > null.log
    rm tmp.yml; rm null.log; cd ../
done

cd ../../


# ----------------------------------------------------------
#  Start AWS Lambda service
# ----------------------------------------------------------

# Install layers
cd lambda/layers

cd umt-ext/nodejs; yarn; cd ../../

cd ../../

params="
    ParameterKey=HostRoot,ParameterValue=$HOST_ROOT
    ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
    ParameterKey=AWSS3WebBucket,ParameterValue=$AWS_S3_WEB_BUCKET
    ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
"
sam local start-lambda \
    -t template.yml \
    --host $LAMBDA_SERVICE_IP \
    --parameter-overrides $params \
    --env-vars lambda/functions/env.json & pids="${pids-} $!"


# ----------------------------------------------------------
#  Execute AWS Lambda
# ----------------------------------------------------------

cd lambda/functions

# lambdas="
#     umt-add-user
#     umt-update-user
#     umt-add-team
#     umt-add-teammember
#     umt-add-teamchat
#     umt-add-match
#     umt-add-matchpatch
#     umt-add-matchchat
#     umt-update-match
#     umt-add-stadium
#     umt-add-court
#     umt-get-user
#     umt-get-team
#     umt-get-match
#     umt-near-teams
#     umt-near-matches
#     umt-list-teams
#     umt-team-requests
#     umt-teammember-requests
#     umt-list-matches
#     umt-match-requests
#     umt-matchpatch-requests
# "

lambdas="
    umt-add-match
    umt-add-matchpatch
    umt-update-match
    umt-get-matchpatch
    umt-list-matchpatches
    umt-near-matches
"

# Install dependencies
for lambda in $lambdas
do
    echo
    echo "----------------------------"
    echo "Installing lambda: $lambda"
    echo "----------------------------"
    cd $lambda; yarn; cd ../
done

# Execute tests
for lambda in $lambdas
do
    echo
    echo "----------------------------"
    echo "Executing lambda: $lambda"
    echo "----------------------------"
    cd $lambda; npm run test; cd ../
done

# Stop services
kill $pids
docker rm arzov-dynamodb -f

# Remove temp files
cd ../../
rm template.yml