const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const express_app = express()

express_app.use(cors());
express_app.use(express.json());
express_app.use(express.urlencoded({ extended: true }));

const PORT = 8080
let portfolio_collection = undefined;

const url = "mongodb+srv://sagarph_db_user:sagarph%40db@cluster0.7epy1hb.mongodb.net/?appName=Cluster0";
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function formatDateTime() {
    const now = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const pad = (n) => String(n).padStart(2, '0');
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    return `${month} ${day}, ${year} - ${hours}:${minutes}`;
}

express_app.post('/logger', async (req, res) => {
    // console.log('Logger called')
    const logger_data = { Date: formatDateTime()}
    try {
        await portfolio_collection.insertOne(logger_data)
    } catch(err) {
        console.log('log failed')
    }
})

async function connect_database() {
    try {
        await client.connect()
        const db = client.db('my_logs')
        portfolio_collection = db.collection('my_logs')

        console.log("Connected to MongoDB");
    } catch (err) {
        console.log('Database connection failed!')
    }
}

express_app.listen(PORT, async () => {
    await connect_database()
    // console.log('started listening')
})