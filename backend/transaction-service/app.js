/**
 * Microservice: transaction-service.
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
    ssl: {
        ssl: true,
        rejectUnauthorized: false
    }
});

app.post('/create-order', async (req, res) => {
    const orderid = 'O-' + Math.round((10000000 + Math.random() * 10000000));
    const userid = req.body.userid;
    const carid = req.body.carid;
    const duration = req.body.duration;
    const ordered = req.body.ordered;
    const name = req.body.name;
    const brand = req.body.brand;
    const from_date = req.body.from_date;
    const end_date = req.body.end_date;

    console.log(`Got create order request for user ${userid}`);

    const qvObject = bind(`insert into orders (orderid, carid, userid, duration, 
            ordered, name, brand, from_date, end_date) 
        values (:orderid, :carid, :userid, :duration, :ordered, :name, :brand, 
            :from_date, :end_date)`,
        {
            orderid: orderid, userid: userid, carid: carid, duration: duration,
            ordered: ordered, name: name, brand: brand, from_date: from_date,
            end_date: end_date
        })
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.json({
                code: -1,
                msg: 'Create order failed!'
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

app.get('/orders', async (_, res) => {
    console.log(`Got request to list all orders.`);
    const qvString = `select * from public.orders order by order_when desc`;
    try {
        const qvResult = await pgClient.query(qvString);
        res.json(qvResult.rows)
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.get('/orders/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Got request to get order detail:`);
    const qvObject = bind(`select * from public.orders where orderid = :id order by order_when desc`, { id: id });
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
});

app.get('/user-orders', async (req, res) => {
    const userid = req.query.userid;
    console.log(`Got request to list orders for user: ${userid}`);
    const qvObject = bind(`select * from public.orders where userid = :userid `, { userid: userid });
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        res.json(qvResult.rows)
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-order', async (req, res) => {
    const id = req.body.id;
    const duration = req.body.duration;
    const ordered = req.body.ordered;
    const from_date = req.body.from_date;
    const end_date = req.body.end_date;

    console.log(`Got request for retrieving user with id ${id}`);
    const qvObject = bind(`update public.orders set duration = :duration, 
            ordered = :ordered, from_date = :from_date, end_date = :end_date  
        where orderid = :id`, {
        id: id, duration: duration, ordered: ordered,
        from_date: from_date, end_date: end_date
    })
    try {
        const qvResult = await pgClient.query(qvObject.text, qvObject.values);
        if (qvResult.rowCount == 0) {
            res.json({
                code: -1,
                msg: 'Order not exists!'
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
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});