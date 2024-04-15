CREATE TABLE users_stage(
    userid VARCHAR(30) NOT NULL UNIQUE,
    fullname VARCHAR(30),
    email VARCHAR(100),
    mobile VARCHAR(30),
    country VARCHAR(30),
    membersince DATE,
    password VARCHAR(30) NOT NULL
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
