#!/usr/bin/env bash

echo "Begins >>>"

npm install

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

echo "Building the image..."
sudo docker build . -t hysunhe/transaction-service:${TAG}

echo "Tagging the image..."
sudo docker tag hysunhe/transaction-service:${TAG} hysunhe/transaction-service:latest

echo "Pushing the image to docker hub..."
sudo docker push hysunhe/transaction-service:latest

echo "Done <<<"