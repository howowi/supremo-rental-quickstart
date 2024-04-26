#!/bin/bash

if [[ -f ~/app.env ]]
then
    source ~/app.env
fi

cat > ~/.oci_docker/config << EOF
[DEFAULT]
user=$USER_OCID
fingerprint=$FINGERPRINT
tenancy=$TENANCY
region=$REGION
key_file=/app/oci/car_demo.pem
EOF

cat > ~/.oci/config << EOF
[DEFAULT]
user=$USER_OCID
fingerprint=$FINGERPRINT
tenancy=$TENANCY
region=$REGION
key_file=~/.oci/car_demo.pem
EOF

echo "OCI config created."