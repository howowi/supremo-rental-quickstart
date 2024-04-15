const fs = require('fs')
const csv = require("csvtojson");
const oracledb = require('oracledb')

oracledb.initOracleClient({});
oracledb.autoCommit = true;

async function run() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "ouser",
            password: "BotWelcome123##",
            connectString: "pocfreeajd_medium",

        });

        // Create the parent object for SODA
        const soda = connection.getSodaDatabase();

        // Create a new SODA collection
        // This will open an existing collection, if the name is already in use.
        collection = await soda.createCollection("cars");

        await collection.truncate();

        // csv().fromFile('../carslist.csv').then((jsonObj) => {
        //     console.log(jsonObj);
        // });

        // return;

        // Insert a document.  A system generated key is created by default.
        content = [
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
}

run()
