#!/usr/bin/env bash
DATE=$(date -I)
docker build . -t matheuskc/ekki-server:$DATE
docker tag matheuskc/ekki-server:$DATE matheuskc/ekki-server:lts
docker tag matheuskc/ekki-server:$DATE matheuskc/ekki-server:latest
docker login -u matheuskc
docker push matheuskc/ekki-server:$DATE
docker push matheuskc/ekki-server:latest
docker push matheuskc/ekki-server:lts