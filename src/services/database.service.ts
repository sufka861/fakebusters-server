import * as mongoDB from "mongodb";

export const collections: {
  users?: mongoDB.Collection;
  LPA?: mongoDB.Collection;
} = {};

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

/* mongo website
export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "");
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME|| "");
 
  collections.users = usersCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
 }*/
