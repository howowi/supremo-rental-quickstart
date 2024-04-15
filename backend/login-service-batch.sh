#!/bin/sh

./login-service.sh

port=8400
for ((i=2; i<=12; i++))
do	

port=$((port+1))
echo $port

nodes=`sudo docker ps -a | grep "login-service$i" | wc -l`
if [[ $nodes > 0 ]]
then
        echo "Stopping exist service..."
        sudo docker stop login-service$i

        echo "Removing exist service..."
        sudo docker rm login-service$i
fi

sudo docker run -d \
    --restart=always \
    --name=login-service$i \
    -e DB_HOST="192.168.3.249" \
    -e DB_PORT="5432" \
    -e DB_NAME="poc_car" \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e POOL_MIN=8 \
    -e POOL_MAX=8 \
    -p $port:8080 \
    hysunhe/login-service:latest

echo "Done"

done
