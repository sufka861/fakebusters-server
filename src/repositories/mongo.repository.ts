import { Collection, DeleteResult, MongoClient, ObjectId } from "mongodb";
import { Filter } from "mongodb";

class GenericDal<T extends { _id?: ObjectId }> {
  private collection: Collection<T>;
  private client: MongoClient;

  constructor(collectionName: string) {
    this.client = new MongoClient(process.env.DB_CONN_STRING || "");
    const db = this.client.db(process.env.DB_NAME);
    this.collection = db.collection<T>(collectionName);
    this.client.connect();
    console.log(`connect to ${collectionName} collection in DB`)
  }

  async getAll(): Promise<T[]> {
      return (await this.collection.find({}).toArray()) as T[];
  }

  async getById(id: string): Promise<T | null> {
    const filter: Filter<T> = { _id: new ObjectId(id) } as Filter<T>;
    return (await this.collection.findOne(filter)) as T;
  }

  async getByFilter(filter: any= {}): Promise<T | null> {
      const document = await this.collection.findOne(filter);
      return document as T | null;
  }

  async create(document: any): Promise<T> {
      const result = await this.collection.insertOne(document);
      return { ...document, _id: result.insertedId };
  }

  async deleteMany(filter: {}): Promise<DeleteResult> {
    return await this.collection.deleteMany(filter);
    }
}


export { GenericDal };
