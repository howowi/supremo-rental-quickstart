/**
 * Microservice: car-service.
 * 2023/12/1 by Hysun He: Initial version. 
 */
const express = require('express');
const parser = require('body-parser')
const oracledb = require('oracledb')

const app = express();
app.use(parser.json());
const port = 8080;

oracledb.initOracleClient({});
oracledb.autoCommit = true;

const server = app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await oracledb.createPool({
            poolAlias: 'car_nocache_pool',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING,
            poolMin: parseInt(process.env.POOL_MIN || 30),
            poolMax: parseInt(process.env.POOL_MAX || 60),
            poolIncrement: parseInt(process.env.POOL_INCR || 5),
            expireTime: 3,
            poolTimeout: 600,
            stmtCacheSize: 50,
            retryCount: 20,
            retryDelay: 3,
            queueMax: 2000
        });
    } catch (err) {
        console.error('Error connecting to ajd', err)
    }
});

// server.keepAliveTimeout = (70 * 1000);
// server.headersTimeout = (70 * 1000) + 1000;

process.on('exit', async (code) => {
    console.log(`!!! Exiting... ${code}`)
    try {
        await oracledb.getPool('car_nocache_pool').close(0);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/cars', async (_, res) => {
    // console.log('Got request for listing all cars.');
    let connection;
    try {
        connection = await oracledb.getPool('car_nocache_pool').getConnection();
        const soda = connection.getSodaDatabase();
        let collection = await soda.createCollection("cars");
        docs = await collection.find().getDocuments();
        results = []
        docs.forEach(doc => {
            let content = doc.getContent();
            results.push(content)
        });
        res.json(results);
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/cars/:id', async function (req, res) {
    // req.query.id vs req.params.id
    const id = req.params.id;
    // console.log(`Got request for retrieving car with id ${id}`);
    let connection;

    try {
        connection = await oracledb.getPool('car_nocache_pool').getConnection();
        const soda = connection.getSodaDatabase();
        let collection = await soda.openCollection("cars");
        doc = await collection.find().filter({ "carid": id }).getOne();
        if (!doc) {
            res.status(404).send(`Entry not found: id=${id}`);
        } else {
            car = doc.getContent();
            car.popular = String(car.popular);
            res.json(car);
        }
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            try {
                // Put the connection back in the pool
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.get('/load-data', async function (_, res) {
    let connection;
    try {
        connection = await oracledb.getPool('car_nocache_pool').getConnection();
        // Create the parent object for SODA
        const soda = connection.getSodaDatabase();

        // Create a new SODA collection
        // This will open an existing collection, if the name is already in use.
        let collection = await soda.createCollection("cars");

        await collection.truncate();

        // csv().fromFile('../carslist.csv').then((jsonObj) => {
        //     console.log(jsonObj);
        // });

        // return;

        // Insert a document.  A system generated key is created by default.
        let content = [
            {
                "carid": "t001",
                "name": "Corolla",
                "brand": "Toyoto",
                "fueltype": "petrol",
                "vehicletype": "sedan",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "20",
                "avail": 20,
                "popular": true
            },
            {
                "carid": "t002",
                "name": "Hilander",
                "brand": "Toyoto",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Singapore",
                "price": "25",
                "avail": 15,
                "popular": true
            },
            {
                "carid": "t003",
                "name": "Alphard",
                "brand": "Toyoto",
                "fueltype": "petrol",
                "vehicletype": "MPV",
                "locations": "Singapore",
                "price": "25",
                "avail": 10,
                "popular": false
            },
            {
                "carid": "t004",
                "name": "Yuan",
                "brand": "BYD",
                "fueltype": "EMV",
                "vehicletype": "sedan",
                "locations": "Singapore",
                "price": "35",
                "avail": 30,
                "popular": false
            },
            {
                "carid": "t005",
                "name": "RAV4",
                "brand": "Toyoto",
                "fueltype": "Hybrid",
                "vehicletype": "SUV",
                "locations": "Sydney, Singapore",
                "price": "30",
                "avail": 25,
                "popular": true
            },
            {
                "carid": "t006",
                "name": "Corolla",
                "brand": "Toyoto",
                "fueltype": "Hybrid",
                "vehicletype": "Hatch",
                "locations": "Sydney, Singapore",
                "price": "12",
                "avail": 30,
                "popular": true
            },
            {
                "carid": "t007",
                "name": "Camry",
                "brand": "Toyoto",
                "fueltype": "Hybrid",
                "vehicletype": "Hatch",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "25",
                "avail": 15,
                "popular": false
            },
            {
                "carid": "t008",
                "name": "Yarris",
                "brand": "Toyoto",
                "fueltype": "petrol",
                "vehicletype": "Hatch",
                "locations": "Sydney",
                "price": "12",
                "avail": 10,
                "popular": false
            },
            {
                "carid": "t009",
                "name": "Elantra",
                "brand": "Hyundai",
                "fueltype": "petrol",
                "vehicletype": "sedan",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "20",
                "avail": 12,
                "popular": false
            },
            {
                "carid": "t010",
                "name": "i30",
                "brand": "Hyundai",
                "fueltype": "petrol",
                "vehicletype": "Hatch",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "12",
                "avail": 35,
                "popular": true
            },
            {
                "carid": "t011",
                "name": "Kona",
                "brand": "Hyundai",
                "fueltype": "Hybrid",
                "vehicletype": "SUV",
                "locations": "Sydney",
                "price": "25",
                "avail": 15,
                "popular": false
            },
            {
                "carid": "t012",
                "name": "CRV",
                "brand": "Honda",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "30",
                "avail": 20,
                "popular": true
            },
            {
                "carid": "t013",
                "name": "HRV",
                "brand": "Honda",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney",
                "price": "25",
                "avail": 12,
                "popular": false
            },
            {
                "carid": "t014",
                "name": "City",
                "brand": "Honda",
                "fueltype": "petrol",
                "vehicletype": "sedan",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "20",
                "avail": 30,
                "popular": true
            },
            {
                "carid": "t015",
                "name": "Civic",
                "brand": "Honda",
                "fueltype": "petrol",
                "vehicletype": "sedan",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "20",
                "avail": 20,
                "popular": false
            },
            {
                "carid": "t016",
                "name": "S",
                "brand": "Tesla",
                "fueltype": "EMV",
                "vehicletype": "sedan",
                "locations": "Sydney, Singapore",
                "price": "30",
                "avail": 10,
                "popular": true
            },
            {
                "carid": "t017",
                "name": "Baleno",
                "brand": "Suzuki",
                "fueltype": "petrol",
                "vehicletype": "Hatch",
                "locations": "Mumbai, Singapore",
                "price": "15",
                "avail": 25,
                "popular": true
            },
            {
                "carid": "t018",
                "name": "Swift",
                "brand": "Suzuki",
                "fueltype": "petrol",
                "vehicletype": "Sedan",
                "locations": "Mumbai",
                "price": "15",
                "avail": 30,
                "popular": true
            },
            {
                "carid": "t019",
                "name": "VITARA",
                "brand": "Suzuki",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "25",
                "avail": 10,
                "popular": false
            },
            {
                "carid": "t020",
                "name": "Ignis",
                "brand": "Suzuki",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Mumbai",
                "price": "20",
                "avail": 10,
                "popular": false
            },
            {
                "carid": "t021",
                "name": "ASX",
                "brand": "Mitsubishi",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "20",
                "avail": 20,
                "popular": true
            },
            {
                "carid": "t022",
                "name": "Outlander",
                "brand": "Mitsubishi",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Singapore",
                "price": "35",
                "avail": 10,
                "popular": true
            },
            {
                "carid": "t023",
                "name": "Pajero",
                "brand": "Mitsubishi",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Singapore",
                "price": "50",
                "avail": 5,
                "popular": false
            },
            {
                "carid": "t024",
                "name": "Sorento",
                "brand": "Kia",
                "fueltype": "petrol",
                "vehicletype": "MPV",
                "locations": "Sydney",
                "price": "50",
                "avail": 7,
                "popular": false
            },
            {
                "carid": "t025",
                "name": "Sportage",
                "brand": "Kia",
                "fueltype": "petrol",
                "vehicletype": "SUV",
                "locations": "Sydney, Singapore",
                "price": "35",
                "avail": 12,
                "popular": true
            },
            {
                "carid": "t026",
                "name": "EV9",
                "brand": "Kia",
                "fueltype": "EMV",
                "vehicletype": "SUV",
                "locations": "Sydney",
                "price": "35",
                "avail": 7,
                "popular": false
            },
            {
                "carid": "t027",
                "name": "Cerato",
                "brand": "Kia",
                "fueltype": "petrol",
                "vehicletype": "Hatch",
                "locations": "Sydney, Mumbai, Singapore",
                "price": "15",
                "avail": 25,
                "popular": true
            }
        ]

        await collection.insertMany(content);

        // Fetch the document back
        docs = await collection.find().getDocuments();
        docs.forEach(doc => {
            let car = doc.getContent();
            console.log(car);
        });

        console.log("Done");

        res.json({
            "status": "OK"
        });
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});
