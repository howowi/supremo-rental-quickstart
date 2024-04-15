#!/usr/bin/env bash

echo "Begins >>>"

npm install

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

echo "Building the image..."
sudo docker build . -t hysunhe/car-health-service:${TAG}

echo "Tagging the image..."
sudo docker tag hysunhe/car-health-service:${TAG} hysunhe/car-health-service:latest

echo "Pushing the image to docker hub..."
sudo docker push hysunhe/car-health-service:latest

echo "Done <<<"
