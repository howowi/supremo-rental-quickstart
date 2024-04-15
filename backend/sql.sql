alter role ouser with createdb;
create database poc_car with owner ouser;
postgres=> \c poc_car

poc_car=> SELECT * FROM pg_catalog.pg_tables;

poc_car=> \dt+

-- PostgreSQL
CREATE TABLE users(
    userid VARCHAR(30) NOT NULL UNIQUE,
    fullname VARCHAR(30),
    email VARCHAR(100),
    mobile VARCHAR(30),
    country VARCHAR(30),
    membersince DATE,
    password VARCHAR(30) NOT NULL
);

-- AJD
CREATE TABLE cars(
    carid VARCHAR NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    brand VARCHAR(30) NOT NULL,
    fueltype VARCHAR(100) NOT NULL,
    vehicletype VARCHAR(30) NOT NULL,
    locations VARCHAR(300),
    price VARCHAR(30) NOT NULL,
    avail INT,
    popular BOOLEAN NOT NULL
);

CREATE TABLE orders(
    orderid VARCHAR NOT NULL UNIQUE,
    carid VARCHAR NOT NULL,
    userid VARCHAR NOT NULL,
    name VARCHAR NULL,
    brand VARCHAR NULL,
    duration INT,
    from_date TIMESTAMP,
    end_date TIMESTAMP,
    ordered BOOLEAN NOT NULL,
    order_when TIMESTAMP DEFAULT NOW()
);

CREATE TABLE CarHealth (
    carid STRING,
    mileage INTEGER,
    fueltype STRING,
    enginepower STRING
    enginestatus STRING,
    transmissiontype STRING,
    fuelLevel STRING,
    lastservicedate TIMESTAMP,
    PRIMARY KEY (carid, lastservicedate)
);

\copy users (userid, fullname, email, mobile, country, membersince, password) from './userlist.csv' DELIMITER ',' CSV HEADER

\copy cars (carid,name,brand,fueltype,vehicletype,locations,price,avail,popular) from './carlist.csv' DELIMITER ',' CSV HEADER

alter table orders add column order_when TIMESTAMP DEFAULT NOW();