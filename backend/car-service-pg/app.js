/**
 * Microservice: car-service.
 * 2023/12/1 by Hysun He: Initial version. 
 */
const express = require('express');
const { Pool } = require('pg');
const bind = require('pg-bind');
const parser = require('body-parser')

const app = express();
app.use(parser.json());

const port = 8080;

const pgClient = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        ssl: true,
        rejectUnauthorized: false
    }
});

app.get('/cars', async (_, res) => {
    console.log('Got request for listing all cars.');
    const qvString = 'SELECT * FROM public.cars';
    try {
        const qvResult = await pgClient.query(qvString);
        res.json(qvResult.rows)
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.get('/cars/:id', async function (req, res) {
    // req.query.id vs req.params.id
    const id = req.params.id;
    console.log(`Got request for retrieving car with id ${id}`);
    const qvObject = bind('SELECT * FROM public.cars where carid = :id', { id: id })
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.status(404).send(`Entry not found: id=${id}`);
        } else {
            res.json(qvResult.rows[0])
        }
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
})

// app.post('/cars/:id/return', async (_, res) => {
//     console.log('Got request /cars/:id/return.');
//     const id = req.params.id;
//     const qvObject = bind('update public.cars set avail = avail + 1 where id = :id', { id: id });
//     try {
//         const qvResult = await pgClient.query(qvObject.text, qvObject.values);
//         if (qvResult.rowCount == 0) {
//             res.json({
//                 code: -1,
//                 msg: 'return car failed!'
//             });
//         } else {
//             res.json({
//                 code: 0,
//                 msg: 'OK'
//             });
//         }
//     } catch (err) {
//         console.error('Error executing query!', err)
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.post('/cars/:id/rent', async (_, res) => {
//     console.log('Got request /cars/:id/rent.');
//     const id = req.params.id;
//     const qvObject = bind('update public.cars set avail = avail - 1 where id = :id', { id: id });
//     try {
//         const qvResult = await pgClient.query(qvObject.text, qvObject.values);
//         if (qvResult.rowCount == 0) {
//             res.json({
//                 code: -1,
//                 msg: 'rent car failed!'
//             });
//         } else {
//             res.json({
//                 code: 0,
//                 msg: 'OK'
//             });
//         }
//     } catch (err) {
//         console.error('Error executing query!', err)
//         res.status(500).send('Internal Server Error');
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});