const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.ENDGAME_USER}:${process.env.ENDGAME_PASS}@cluster0.one90zt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const collegeDataCollection = client.db('endgameTaskDB').collection('collegeData');
        const admissionDataCollection = client.db('endgameTaskDB').collection('admissionData');

        app.get('/colleges', async (req, res) => {
            const result = await collegeDataCollection.find().toArray();
            res.send(result);
        })

        app.get('/collegeDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collegeDataCollection.findOne(query);
            res.send(result)
        })


        app.post('/admissionData', async (req, res) => {
            const admissionInfo = req.body;
            const result = await admissionDataCollection.insertOne(admissionInfo);
            res.send(result)
        })

        app.get('/mycollege', async (req, res) => {
            const result = await admissionDataCollection.find().toArray();
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('endgame task server is running')
})

app.listen(port, () => {
    console.log(`endgame task is running on port ${port}`);
})
