import express from "express";
import path from "path";
import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";
import { title } from "process";

const app = express();
const url = "mongodb://localhost:27017";

const publicPath = path.resolve("public");
app.use(express.static(publicPath));
app.set("view engine", "ejs");

const dbName = "Node-Todo";
const collectionName = "Todo-List";
const client = new MongoClient(url);

const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();
  console.log(result);
  res.render("list", { result });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/add", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.insertOne(req.body);

  if (result) {
    res.redirect("/");
  } else {
    res.redirect("/add");
  }
});
app.get("/delete/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (result) {
    res.redirect("/");
  } else {
    res.send("/SomeThing Wrong");
  }
});

app.get("/update/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  if (result) {
    res.render("update", { result });
  } else {
    res.send("Some error");
  }
});
app.post("/update/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const filter = {
    _id: new ObjectId(req.params.id),
  };

  const updateData = {
    $set: { title: req.body.title, description: req.body.description },
  };

  const result = await collection.updateOne(filter, updateData);
  if (result) {
    res.redirect("/");
  } else {
    res.send("Something Wrongs");
  }
});

app.post("/update", (req, res) => {
  res.redirect("/");
});
app.listen(3200);
