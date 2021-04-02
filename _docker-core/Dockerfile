FROM ubuntu:20.04
COPY installers /installers
WORKDIR /installers
ARG DEBIAN_FRONTEND=noninteractive
RUN ./curl.sh
RUN ./unzip.sh
RUN ./wget.sh
RUN ./aws.sh
RUN ./aws_sam.sh
RUN ./nodejs.sh
RUN ./ping.sh
RUN ./docker.sh
RUN npm i -g yarn
WORKDIR /var/opt