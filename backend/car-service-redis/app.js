/**
 * Microservice: car-service.
 * 2023/12/1 by Hysun He: Initial version. 
 */
const express = require('express');
const parser = require('body-parser')
const oracledb = require('oracledb')
const redis = require('redis')

const app = express();
app.use(parser.json());
const port = 8080;

oracledb.initOracleClient({});
oracledb.autoCommit = true;

const REDIS_EXPIRE_SECONDS = 60 * 60 * 24;
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        tls: true
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));

const server = app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await oracledb.createPool({
            poolAlias: 'car_cache_pool',
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
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to ajd/redis', err)
    }
});

// server.keepAliveTimeout = (70 * 1000);
// server.headersTimeout = (70 * 1000) + 1000;

process.on('exit', async (code) => {
    console.log(`!!! Exiting... ${code}`)
    try {
        await oracledb.getPool('car_cache_pool').close(0);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/cars', async (_, res) => {
    // console.log('Got request for listing all cars.');
    let connection;
    try {
        connection = await oracledb.getPool('car_cache_pool').getConnection();
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
        let cacheKey = 'car_' + id;
        // console.log(`Cache key is ${cacheKey}`);
        if (await redisClient.exists(cacheKey)) {
            let car = await redisClient.hGetAll(cacheKey);
            res.json(car);
            return;
        }

        // console.log('cache miss');
        connection = await oracledb.getPool('car_cache_pool').getConnection();
        const soda = connection.getSodaDatabase();
        let collection = await soda.createCollection("cars");
        doc = await collection.find().filter({ "carid": id }).getOne();
        if (!doc) {
            res.status(404).send(`Entry not found: id=${id}`);
        } else {
            car = doc.getContent();
            // car.id = doc.key;
            car.popular = String(car.popular);
            // Add to cache.
            // console.log('add to cache:', car);
            await redisClient.hSet(cacheKey, car, 'EX', REDIS_EXPIRE_SECONDS);
            // console.log('done');
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
