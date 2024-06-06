import { Collection, DeleteResult, MongoClient, ObjectId, UpdateResult } from "mongodb";
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

  async getByFilter(filter: any = {}): Promise<T[]> {
    const documents = await this.collection.find(filter).toArray();
    return documents as T[];
}

async getOneByFilter(filter: any = {}): Promise<T | null> {
  return (await this.collection.findOne(filter)) as T;
}
  async create(document: any): Promise<T> {
      const result = await this.collection.insertOne(document);
      return { ...document, _id: result.insertedId };
  }

  async deleteMany(filter:any= {}): Promise<DeleteResult> {
    return await this.collection.deleteMany(filter);
    }

    async updateById(id:any,params:any): Promise<UpdateResult> {
      return await this.collection.updateOne(id,params);
      }

      async updateByFilter(project_id:any,params:any): Promise<UpdateResult> {
        return await this.collection.updateOne(project_id,params);
        }
}


export { GenericDal };
