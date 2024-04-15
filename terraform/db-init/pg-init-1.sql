create user <PG_USER> with password '<PG_PASSWORD>';

alter role <PG_USER> with LOGIN;

alter role <PG_USER> with createdb;

create database <PG_DBNAME>;

