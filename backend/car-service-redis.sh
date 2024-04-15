#!/bin/bash

nodes=`sudo docker ps -a | grep 'car-service-redis0' | wc -l`
if [[ $nodes > 0 ]]
then
	echo "Stopping exist service..."
	sudo docker stop car-service-redis0

	echo "Removing exist service..."
	sudo docker rm car-service-redis0
fi

#image=`sudo docker images | grep 'hysunhe/car-service-redis0' | awk '{print $3}'`
#if [[ -n "$image" ]]
#then
#	echo "Removing local image..."
#	sudo docker rmi -f $image
#fi

sudo docker pull hysunhe/car-service-ajd

sudo docker run -d \
    --restart=always \
    --name=car-service-redis0 \
    -v ~/wallet:/app/wallet \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e DB_CONNECTION_STRING="pocfreeredis_medium" \
    -e POOL_MIN=1 \
    -e POOL_MAX=1 \
    -e POOL_INCR=1 \
    -e REDIS_HOST="amaaaaaaak7gbriaf6dx7tua3h7eab3iu3txsi5nq2ylzo6jxhcyipikb6kq-p.redis.ap-seoul-1.oci.oraclecloud.com" \
    -e REDIS_PORT="6379" \
    -p 8081:8080 \
    hysunhe/car-service-ajd:latest

echo "Done"


