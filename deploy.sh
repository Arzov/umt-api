#!/bin/bash
# ==========================================================
# Deploy backend to AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Create template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh


# ----------------------------------------------------------
#  Build AWS Lambda
# ----------------------------------------------------------

# Install layers
cd lambda/layers

cd umt-ext/nodejs; yarn; cd ../../

cd ../../

# AWS SAM build
params="
    ParameterKey=HostRoot,ParameterValue=$HOST_ROOT
    ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
    ParameterKey=AWSS3WebBucket,ParameterValue=$AWS_S3_WEB_BUCKET
    ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
"
sam build -t template.yml --parameter-overrides $params


# ----------------------------------------------------------
#  Deploy to AWS
# ----------------------------------------------------------

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset \
    --stack-name umt \
    --s3-prefix umt \
    --region $AWS_DEFAULT_REGION \
    --capabilities CAPABILITY_IAM \
    --s3-bucket $AWS_S3_ARTIFACTS_BUCKET \
    --parameter-overrides $params \
    --no-fail-on-empty-changeset

# Remove temp files
cd ../../
rm template.yml
rm -R .aws-sam