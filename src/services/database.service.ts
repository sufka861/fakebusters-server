import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_CONN_STRING || "");

export async function connectToDatabase() {
    await client.connect();
    console.log("Connected to MongoDB");
}