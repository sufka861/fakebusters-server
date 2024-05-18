import { ObjectId } from "mongodb";
import { GenericDAL } from "./genericDal";

interface Result {
  _id?: ObjectId;
  analysis_id: string;
  account: number;
  freq: number;
  initial_authors_count: number;
  initial_posts_count: number;
  categories: string[];
  data: number[];
  word: number;
  results: object[]
}

const lpaDAL = new GenericDAL<Result>(process.env.LPA_COLLECTION_NAME || "");

const getResults = async () => {
  return await lpaDAL.getAll();
};

const getResultById = async ( id: string) => {
    return await lpaDAL.getById(id);
};

const createResult = async (body: any) => {
    return await lpaDAL.create(body);
};

export { getResults, getResultById, createResult };
