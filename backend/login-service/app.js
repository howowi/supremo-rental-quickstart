/**
 * Microservice: login-service.
 * 2023/12/1 by Hysun He: Initial version. 
 */
const express = require('express');
const parser = require('body-parser')
const { Pool } = require('pg');
const bind = require('pg-bind');

const app = express();
app.use(parser.json());

const port = 8080;

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

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// server.keepAliveTimeout = (70 * 1000);
// server.headersTimeout = (70 * 1000) + 1000;

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
    const qvObject = bind('SELECT * FROM public.users where userid = :id', { id: id })
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.status(404).send(`Entry not found with id ${id}`);
        } else {
            res.json(qvResult.rows[0])
        }
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
})
