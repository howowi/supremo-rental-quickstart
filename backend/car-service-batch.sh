#!/bin/sh

./car-service.sh

port=8200
for ((i=2; i<=12; i++))
do	

port=$((port+1))
echo $port

nodes=`sudo docker ps -a | grep "car-service$i" | wc -l`
if [[ $nodes > 0 ]]
then
        echo "Stopping exist service..."
        sudo docker stop car-service$i

        echo "Removing exist service..."
        sudo docker rm car-service$i
fi

sudo docker run -d \
    --restart=always \
    --name=car-service$i \
    -v ~/wallet:/app/wallet \
    -e DB_USER="ouser" \
    -e DB_PASSWORD="BotWelcome123##" \
    -e DB_CONNECTION_STRING="pocfreeajd_medium" \
    -e POOL_MIN=23 \
    -e POOL_MAX=23 \
    -e POOL_INCR=1 \
    -p $port:8080 \
    hysunhe/car-service:latest

echo "Done"

done
