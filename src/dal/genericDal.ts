import { Collection, MongoClient, ObjectId } from "mongodb";
import { Filter } from "mongodb";

class GenericDAL<T extends { _id?: ObjectId }> {
  private collection: Collection<T>;
  private client: MongoClient;

  constructor(collectionName: string) {
    this.client = new MongoClient(process.env.DB_CONN_STRING || "");
    const db = this.client.db(process.env.DB_NAME);
    this.collection = db.collection<T>(collectionName);
  }

  async getAll(): Promise<T[]> {
    try {
      await this.client.connect();
      const documents = (await this.collection.find({}).toArray()) as T[];
      return documents;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      await this.client.close();
    }
  }

  async getById(id: string): Promise<T | null> {
    await this.client.connect();
    const filter: Filter<T> = { _id: new ObjectId(id) } as Filter<T>;
    const document = (await this.collection.findOne(filter)) as T;
    if (document) {
      return document;
    }
    await this.client.close();
    return null;
  }

  async create(document: any): Promise<T> {
    try {
      await this.client.connect();
      const result = await this.collection.insertOne(document);
      return { ...document, _id: result.insertedId };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await this.client.close();
    }
  }
}

export { GenericDAL };
