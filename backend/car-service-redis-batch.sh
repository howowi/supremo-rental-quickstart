#!/bin/sh

./car-service-redis.sh

port=8300
for ((i=2; i<=12; i++))
do	

port=$((port+1))
echo $port

nodes=`sudo docker ps -a | grep "car-service-redis$i" | wc -l`
if [[ $nodes > 0 ]]
then
        echo "Stopping exist service..."
        sudo docker stop car-service-redis$i

        echo "Removing exist service..."
        sudo docker rm car-service-redis$i
fi

sudo docker run -d \
    --restart=always \
    --name=car-service-redis$i \
    -v ~/wallet:/app/wallet \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e DB_CONNECTION_STRING="pocfreeajd_medium" \
    -e POOL_MIN=1 \
    -e POOL_MAX=1 \
    -e POOL_INCR=1 \
    -e REDIS_HOST="amaaaaaaak7gbriaf6dx7tua3h7eab3iu3txsi5nq2ylzo6jxhcyipikb6kq-p.redis.ap-seoul-1.oci.oraclecloud.com" \
    -e REDIS_PORT="6379" \
    -p $port:8080 \
    hysunhe/car-service-ajd:latest

echo "Done"

done
