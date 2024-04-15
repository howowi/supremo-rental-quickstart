#!/bin/sh

./login-service-redis.sh

port=8500
for ((i=2; i<=12; i++))
do	

port=$((port+1))
echo $port

nodes=`sudo docker ps -a | grep "login-service-redis$i" | wc -l`
if [[ $nodes > 0 ]]
then
        echo "Stopping exist service..."
        sudo docker stop login-service-redis$i

        echo "Removing exist service..."
        sudo docker rm login-service-redis$i
fi

sudo docker run -d \
    --restart=always \
    --name=login-service-redis$i \
    -e DB_HOST="192.168.3.249" \
    -e DB_PORT="5432" \
    -e DB_NAME="poc_car" \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e POOL_MIN=1 \
    -e POOL_MAX=1 \
    -e REDIS_HOST="amaaaaaaak7gbriaf6dx7tua3h7eab3iu3txsi5nq2ylzo6jxhcyipikb6kq-p.redis.ap-seoul-1.oci.oraclecloud.com" \
    -e REDIS_PORT="6379" \
    -p $port:8080 \
    hysunhe/login-service-redis:latest

echo "Done"

done
