import { Request, Response, RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { promises as fs } from "fs";
import {
  deleteVocabulary,
  getVocabularyByFilter,
  getVocabularies,
  createVocabulary,
} from "../repositories/vocabulary.repository";
import path from "path";

const removeVocabulary: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deleteVocabulary(req.body);
    res.status(200).send("profiles have been deleted");
  } catch (err) {
    res.status(400).send(err);
  }
};
const getAllVocabularies: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getVocabularies();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getVocabularyById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { _id } = req.params;
    const o_id = new ObjectId(_id);
    const data = await getVocabularyByFilter({ _id: o_id });
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const getVocabularyByUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { createdBy } = req.params;
    const data = await getVocabularyByFilter({ createdBy: createdBy });
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const getDefaultVocabularyByUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { createdBy } = req.params;
    const filter = {
      createdBy: createdBy,
      default: true,
    };
    const data = await getVocabularyByFilter(filter);
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const addVocabulary: RequestHandler = async (req: Request, res: Response) => {
  try {
    const newVoc = req.body;
    const data = await createVocabulary(newVoc);
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

const addDefaultVocabulary: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const jsonDefault = path.resolve(process.cwd(), "src", "python", "data", "vocabularyDefault.json");
    const terms = JSON.parse(
        await fs.readFile(jsonDefault, "utf8")
      );
      const {createdBy} = req.body
    const newVoc = {
    createdBy: createdBy,
    terms: terms,
    name : "System Default Stop-Words",
    is_default : true
    }
    const data = await createVocabulary(newVoc);
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export {
  addDefaultVocabulary,
  removeVocabulary,
  getAllVocabularies,
  getVocabularyById,
  addVocabulary,
  getVocabularyByUser,
  getDefaultVocabularyByUser,
};
