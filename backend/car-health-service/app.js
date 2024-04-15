/**
 * Microservice: car-health-service.
 * 2023/12/12 by Hysun He: Initial version. 
 */
const express = require('express');
const parser = require('body-parser')
const NoSQLClient = require('oracle-nosqldb').NoSQLClient;
const Region = require('oracle-nosqldb').Region

const app = express();
app.use(parser.json());
const port = 8080;

const client = new NoSQLClient({
    region: Region.fromRegionCodeOrId(process.env.REGION),
    timeout: 20000,
    ddlTimeout: 40000,
    compartment: process.env.COMPARTMENT,
    auth: {
        iam: {
            configFile: process.env.OCI_CONFIG_FILE,
            profileName: process.env.OCI_CONFIG_PROFILE
        }
    }
});

app.get('/cars/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Got request for retrieve car health: ${id}`);

    const qvString = `SELECT * FROM CarHealth WHERE carid='${id}'`;
    try {
        const qvResult = await client.query(qvString);
        res.json(qvResult.rows)
    } catch (err) {
        console.error('Error executing query!', err)
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});