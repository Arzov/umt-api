#!/bin/bash
# ==========================================================
# Testing backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh


# ----------------------------------------------------------
#  Levantar servicio AWS DynamoDB
# ----------------------------------------------------------

docker run \
    --name arzov-dynamodb \
    -p 8000:8000 \
    -d \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar \
    -inMemory -sharedDb

# Crear tablas
cd dynamodb/tables

declare -A tables=(
  [umt-001]=5
)

for table in "${!tables[@]}"
do
    ln="${tables[$table]}"
    cd $table
    awk "NR >= ${ln}" resource.yml > tmp.yml
    aws dynamodb create-table \
        --cli-input-yaml file://tmp.yml \
        --endpoint-url http://127.0.0.1:8000 \
        --cli-connect-timeout 60000 \
        > null.log
    rm tmp.yml; rm null.log; cd ../
done

cd ../../


# ----------------------------------------------------------
#  Levantar servicio AWS Lambda
# ----------------------------------------------------------

# Instalar layers
cd lambda/layers

cd umt-ext/nodejs; npm install; cd ../../

cd ../../

params="
    ParameterKey=HostRoot,ParameterValue=$HOST_ROOT
    ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
    ParameterKey=AWSS3WebBucket,ParameterValue=$AWS_S3_WEB_BUCKET
    ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
"
sam local start-lambda \
    -t template.yml \
    --host 0.0.0.0 \
    --parameter-overrides $params \
    --env-vars lambda/functions/env.json & pids="${pids-} $!"


# ----------------------------------------------------------
#  Pruebas AWS Lambda
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
    umt-add-team
"

for lambda in $lambdas
do
    cd $lambda; npm install
    cd ../
done

for lambda in $lambdas
do
    cd $lambda; npm run test
    cd ../
done

# Detener servicios
kill $pids
docker rm arzov-dynamodb -f

# Remover archivos temporales
cd ../../
rm template.yml