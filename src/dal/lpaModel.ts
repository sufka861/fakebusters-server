import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { RequestHandler } from "express";
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

const getResults: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const results = await lpaDAL.getAll();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const getResultById: RequestHandler = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const result = await lpaDAL.getById(id);
    if (result) {
      console.log(res);
      res.status(200).send(result);
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching analysis with id: ${req.params.id}`);
  }
};

const createResult: RequestHandler = async (req: Request, res: Response) => {
  try {
    const newResult = await lpaDAL.create(req.body);
    newResult
      ? res
          .status(201)
          .send(
            `Successfully created a new lpa analysis with id ${newResult._id}`,
          )
      : res.status(500).send("Failed to create a new lpa analysis.");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export { getResults, getResultById, createResult };
