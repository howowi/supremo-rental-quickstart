#!/usr/bin/env bash

echo "Begins >>>"

npm install

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

echo "Building the image..."
sudo docker build . -t hysunhe/login-service-redis:${TAG}

echo "Tagging the image..."
sudo docker tag hysunhe/login-service-redis:${TAG} hysunhe/login-service-redis:latest

echo "Pushing the image to docker hub..."
sudo docker push hysunhe/login-service-redis:latest

echo "Done <<<"