const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// mondodb operation
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8vxmi4o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const ceramicsAndPotteryCollection = client
      .db("ceramicsAndPotteryDB")
      .collection("products");

    const categoriesCollection = client
      .db("ceramicsAndPotteryDB")
      .collection("categories");

    app.post("/allProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await ceramicsAndPotteryCollection.insertOne(newProduct);
      console.log(newProduct);
      res.send(result);
    });

    app.put("/allProducts/:id", async (req, res) => {
      const updateCraftInfo = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = {
        $set: {
          product_name: updateCraftInfo.product_name,
          category: updateCraftInfo.category,
          photoURL: updateCraftInfo.photoURL,
          price: updateCraftInfo.price,
          time: updateCraftInfo.time,
          stock: updateCraftInfo.stock,
          customize: updateCraftInfo.customize,
          rating: updateCraftInfo.rating,
          product_details: updateCraftInfo.product_details,
        },
      };
      const result = await ceramicsAndPotteryCollection.updateOne(
        filter,
        updateCraft,
        options
      );
      res.send(result);
    });

    app.delete("/allProducts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await ceramicsAndPotteryCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/allProducts", async (req, res) => {
      const result = await ceramicsAndPotteryCollection.find().toArray();
      res.send(result);
    });

    app.get("/allProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ceramicsAndPotteryCollection.findOne(query);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const query = await categoriesCollection.find().toArray();
      res.send(query);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Licarie server is running");
});

app.listen(port, () => {
  console.log(`Licerie server is running port ${port}`);
});
