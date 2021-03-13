#!/bin/bash
# ==========================================================
# Instalar AWS SAM
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================

wget "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip"
sha256sum aws-sam-cli-linux-x86_64.zip
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
./sam-installation/install
sam --version