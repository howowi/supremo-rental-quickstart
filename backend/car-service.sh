#!/bin/bash

nodes=`sudo docker ps -a | grep 'car-service0' | wc -l`
if [[ $nodes > 0 ]]
then
	echo "Stopping exist service..."
	sudo docker stop car-service0

	echo "Removing exist service..."
	sudo docker rm car-service0
fi

#image=`sudo docker images | grep 'hysunhe/car-service' | awk '{print $3}'`
#if [[ -n "$image" ]]
#then
#	echo "Removing local image..."
#	sudo docker rmi -f $image
#fi

sudo docker pull hysunhe/car-service

sudo docker run -d \
    --restart=always \
    --name=car-service0 \
    -v ~/wallet:/app/wallet \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e DB_CONNECTION_STRING="pocfreeajd_medium" \
    -e POOL_MIN=23 \
    -e POOL_MAX=23 \
    -e POOL_INCR=1 \
    -p 8084:8080 \
    hysunhe/car-service:latest

echo "Done"

