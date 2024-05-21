import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(process.env.DB_CONN_STRING || "");
      await client.connect();
      db = client.db(process.env.DB_NAME);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error("Database not connected. Please connect to the database first.");
  }
  return db;
}
