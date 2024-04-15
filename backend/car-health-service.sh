#!/bin/bash

nodes=`sudo docker ps -a | grep 'hysunhe/car-health-service' | wc -l`
if [[ $nodes > 0 ]]
then
	echo "Stopping exist service..."
	sudo docker stop car-health-service

	echo "Removing exist service..."
	sudo docker rm car-health-service
fi

#image=`sudo docker images | grep 'hysunhe/car-health-service' | awk '{print $3}'`
#if [[ -n "$image" ]]
#then
#	echo "Removing local image..."
#	sudo docker rmi -f $image
#fi

sudo docker pull hysunhe/car-health-service

sudo docker run -d \
    --restart=always \
    --name=car-health-service \
    -v ~/.oci/fordocker/:/app/oci/ \
    -e REGION="ap-seoul-1" \
    -e COMPARTMENT="ocid1.compartment.oc1..aaaaaaaam5akmizz6fzm7old5rqjlsrrckelfv6tyw24woxhtwzmpu4x6ioq" \
    -e OCI_CONFIG_FILE="/app/oci/config" \
    -e OCI_CONFIG_PROFILE="DEFAULT" \
    -p 8086:8080 \
    hysunhe/car-health-service:latest

echo "Done"


