#!/bin/bash

nodes=`sudo docker ps | grep 'hysunhe/transaction-service' | wc -l`
if [[ $nodes > 0 ]]
then
	echo "Stopping exist service..."
	sudo docker stop transaction-service

	echo "Removing exist service..."
	sudo docker rm transaction-service
fi

#image=`sudo docker images | grep 'hysunhe/transaction-service' | awk '{print $3}'`
#if [[ -n "$image" ]]
#then
#	echo "Removing local image..."
#	sudo docker rmi -f $image
#fi

sudo docker pull hysunhe/transaction-service

echo "Downloading latest image and run it..."

sudo docker run -d \
    --restart=always \
    --name=transaction-service \
	-e DB_HOST="192.168.3.249" \
	-e DB_PORT="5432" \
	-e DB_NAME="poc_car" \
	-e DB_USER="ouser" \
	-e DB_PASSWORD="BotWelcome123##" \
    -p 8083:8080 \
    hysunhe/transaction-service:latest

echo "Done"

