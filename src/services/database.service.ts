import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_CONN_STRING || "");

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}