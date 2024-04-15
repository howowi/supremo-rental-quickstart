#!/bin/bash

if [[ -f ~/app.env ]]
then
    source ~/app.env
fi

sed -i "s/<PG_DBNAME>/$PG_DBNAME/g" ~/db-init/pg-init-1.sql
sed -i "s/<PG_USER>/$PG_USER/g" ~/db-init/pg-init-1.sql
sed -i "s/<PG_PASSWORD>/$PG_PASSWORD/g" ~/db-init/pg-init-1.sql

psql "sslmode=require host=$PG_ENDPOINT dbname=postgres user=$PG_ADMIN_USER password=$PG_ADMIN_PASSWORD" < ~/db-init/pg-init-1.sql

psql "sslmode=require host=$PG_ENDPOINT dbname=$PG_DBNAME user=$PG_USER password=$PG_PASSWORD" < ~/db-init/pg-init-2.sql

psql "sslmode=require host=$PG_ENDPOINT dbname=$PG_DBNAME user=$PG_USER password=$PG_PASSWORD" -c "\copy users_stage (userid, fullname, email, mobile, country, membersince, password) from '~/db-init/userlist.csv' DELIMITER ',' CSV HEADER;"

psql "sslmode=require host=$PG_ENDPOINT dbname=$PG_DBNAME user=$PG_USER password=$PG_PASSWORD" < ~/db-init/pg-init-3.sql
