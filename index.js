const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()



// MIDDLEWARE
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hywmoi.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const menuCollection = client.db("bistroDb").collection('menu');
    const reviewCollection = client.db("bistroDb").collection('reviews');
    const cartCollection = client.db("bistroDb").collection('carts');

    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    app.get('/review', async(req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })


    // cart collection
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/carts', async(req, res)=> {
      const item = req.body;
      console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('boss is sitting');
})

app.listen(port, ()=> {
    console.log(`Bistro boss is sitting on port: ${port}`);
})

/**
 * --------------------
 * Naming convention
 * --------------------
 * 
 * users: userCollection
 * app.get('/users') =>  sob gulo user k pete ata use kora hoy
 * app.get('/users/:id) => kono akta single ba particular user k pete ata use kora hoy
 * app.post('/users') => notun akta user create korte ata use kora hoy
 * app.patch('/users/:id') => ata diye kono akta particular use k update korte use kora hoy
 * app.put('/users/:id') => same to patch
 * app.delete('/users/:id') => delete korte
 * 
 * */ 