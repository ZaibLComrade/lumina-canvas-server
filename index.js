const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

// Initialize
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors({
	origin: ["http://localhost:5173"],
	credentials: true,
}));


const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database
const database = client.db("lumina-canvas");

const taskCollection = database.collection("tasks");

// Get tasks data by status
app.get("/tasks", async(req, res) => {
	const type = req.query.type;
	const email = req.query.email;
	const filter = { status: type, email }
	const tasks = await taskCollection.find(filter).toArray();
	res.send(tasks);
})

// Create task
app.post("/tasks", async(req, res) => {
	const task = req.body;
	const result = await taskCollection.insertOne(task);
	res.send(result);
})

// Delete task
app.delete("/tasks/:id", async(req, res) => {
	const id = req.params.id;
	const query = { _id: new ObjectId(id) };
	const result = await taskCollection.deleteOne(query);
	console.log(query, result);
	res.send(result);
})

// Check server health
app.get("/health", (req, res) => {
	res.send("Server is running");
})

app.listen(port, () => console.log("Listening to port", port))
