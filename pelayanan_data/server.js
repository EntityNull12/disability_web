const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://aqilabihar123:DaIiYYWnwivSQqXc@disabilitycare.28s6dmd.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();
        const database = client.db('yourDatabaseName'); // Replace with your database name
        const collection = database.collection('yourCollectionName'); // Replace with your collection name

        app.get('/data', async (req, res) => {
            const data = await collection.find({}).toArray();
            res.json(data);
        });

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
