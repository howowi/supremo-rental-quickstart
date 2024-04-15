/**
 * Microservice: login-service.
 * 2023/12/1 by Hysun He: Initial version. 
 */
const express = require('express');
const parser = require('body-parser')
const { Pool } = require('pg');
const bind = require('pg-bind');
const redis = require('redis')

const app = express();
app.use(parser.json());

const port = 8080;

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
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to redis', err)
    }
});

// server.keepAliveTimeout = (70 * 1000);
// server.headersTimeout = (70 * 1000) + 1000;

const pgClient = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    min: parseInt(process.env.POOL_MIN || 30),
    max: parseInt(process.env.POOL_MAX || 60),
    idleTimeoutMillis: 600000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 300000,
    ssl: {
        ssl: true,
        rejectUnauthorized: false
    }
});

app.post('/authn', async (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;
    console.log(`Got authentication request for user ${userid}`);

    const qvObject = bind('select 1 from public.users where userid = :userid and password = :password', { userid: userid, password: password })
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.json({
                code: -1,
                msg: 'Authentication failed!'
            });
        } else {
            res.json({
                code: 0,
                msg: 'OK'
            });
        }
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users', async (_, res) => {
    console.log('Got request for listing all users.');
    const qvString = 'SELECT userid, fullname, email, mobile, country, membersince FROM public.users';
    try {
        const qvResult = await pgClient.query(qvString);
        res.json(qvResult.rows)
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(`Got request for retrieving user with id ${id}`);
    try {
        let cacheKey = 'user_' + id;

        if (await redisClient.exists(cacheKey)) {
            let user = await redisClient.hGetAll(cacheKey);
            res.json(user);
            return;
        }

        // console.log('cache miss');
        const qvObject = bind('SELECT * FROM public.users where userid = :id', { id: id })
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.status(404).send(`Entry not found with id ${id}`);
        } else {
            let user = qvResult.rows[0];
            user.membersince = String(user.membersince);
            res.json(user);
            // console.log('add to cache', user);
            await redisClient.hSet(cacheKey, user, 'EX', REDIS_EXPIRE_SECONDS);
        }
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});