const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const express_app = express()

express_app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

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

function formatIndianDateTime() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find(p => p.type === type)?.value;

    return `${get("month")} ${get("day")}, ${get("year")} - ${get("hour")}:${get("minute")}`;
}

express_app.post('/logger', async (req, res) => {
    // console.log('Logger called')
    const logger_data = { Date: formatIndianDateTime()}
    try {
        await portfolio_collection.insertOne(logger_data)
        res.send({status: 'success'})
    } catch(err) {
        res.send({status: 'failed'})
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



