const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// user: travel
// pass: JNozkuikTcVCxd7U

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ${process.env.DB_USER}:${process.env.DB_PASS}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3q4pz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)



async function run() {
    try {
        await client.connect();
        const database = client.db('travel');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API
        app.get('/myorder', async (req, res) => {
            const email =req.query.email;
            const result = await ordersCollection.find({
                email: email,
              }).toArray();
            console.log(email)
            res.send(result);
        });

         // GET API
         app.get('/allorder', async (req, res) => {
            
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            // console.log(email)
            res.send(orders);
        });

        

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);

            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
        // DELETE API
        app.delete('/allorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            console.log(id,updatedStatus)
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
              $set: {
                status: updatedStatus.status,
              },
            };
            const result = await ordersCollection.updateOne(filter, updateInfo);
            console.log(result);
            res.send(result);
          });

        

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Running travel Server on port', port);
})