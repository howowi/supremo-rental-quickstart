#!/usr/bin/env bash

echo "Begins >>>"

npm install

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

echo "Building the image..."
sudo docker build . -t hysunhe/car-service:${TAG}

echo "Tagging the image..."
sudo docker tag hysunhe/car-service:${TAG} hysunhe/car-service:latest

echo "Pushing the image to docker hub..."
sudo docker push hysunhe/car-service:latest

echo "Done <<<"
