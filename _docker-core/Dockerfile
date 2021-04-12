FROM node:lts-alpine3.13
ENV GLIBC_VER=2.31-r0
COPY installers /installers
WORKDIR /installers
RUN sh bash.sh
RUN sh aws.sh
RUN sh aws_sam.sh
RUN sh docker.sh
WORKDIR /var/opt