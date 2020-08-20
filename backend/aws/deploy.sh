#!/bin/bash
# ==========================================================
# Deploy backend en AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Generar template.yml
# ----------------------------------------------------------

chmod +x samtemplate.sh; ./samtemplate.sh
status=$?


# ----------------------------------------------------------
#  Build local para AWS Lambda
# ----------------------------------------------------------

# Instalar layers
cd lambda/layers

cd umt/nodejs; npm install; cd ../../

cd ../../

# AWS SAM build
sam build -t template.yml \
    --parameter-overrides "
        ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
        ParameterKey=AWSS3PWABucket,ParameterValue=$AWS_S3_PWA_BUCKET
        ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
    "
status=$((status + $?))


# ----------------------------------------------------------
#  Deploy en AWS
# ----------------------------------------------------------

# AWS SAM deploy
cd .aws-sam/build/
sam deploy --no-confirm-changeset \
    --stack-name umt \
    --s3-prefix umt \
    --region $AWS_DEFAULT_REGION \
    --capabilities CAPABILITY_IAM \
    --s3-bucket $AWS_S3_ARTIFACTS_BUCKET \
    --parameter-overrides "
        ParameterKey=AWSDefaultRegion,ParameterValue=$AWS_DEFAULT_REGION
        ParameterKey=AWSS3PWABucket,ParameterValue=$AWS_S3_PWA_BUCKET
        ParameterKey=AWSR53UMTDomain,ParameterValue=$AWS_R53_UMT_DOMAIN
    " \
    --no-fail-on-empty-changeset
status=$((status + $?))

# Remover archivos temporales
cd ../../
rm template.yml
rm -R .aws-sam
status=$((status + $?))

exit $status