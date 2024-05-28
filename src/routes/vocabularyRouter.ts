import express from "express";
import {
  getAllVocabularies,
  getVocabularyById,
  addVocabulary,
  getVocabularyByUser,
  getDefaultVocabularyByUser,
  addDefaultVocabulary,
  getNonDefaultVocabularyByUser,
  removeVocabularyById,
  editVocabulary,
  getParamsVocabularyByUser,
} from "../controllers/vocabularyController";

const vocabularyRouter = express.Router();

vocabularyRouter.get("/", getAllVocabularies);
vocabularyRouter.get("/:_id", getVocabularyById);
vocabularyRouter.get("/vocabulary/:createdBy", getVocabularyByUser);
vocabularyRouter.get("/vocabularyDefault/:createdBy", getDefaultVocabularyByUser);
vocabularyRouter.get("/vocabularyNonDefault/:createdBy", getNonDefaultVocabularyByUser);
vocabularyRouter.post("/", addVocabulary);
vocabularyRouter.post("/default", addDefaultVocabulary);
vocabularyRouter.delete("/:_id", removeVocabularyById);
vocabularyRouter.put('/:id', editVocabulary);
vocabularyRouter.get("/params/:createdBy", getParamsVocabularyByUser);


export default vocabularyRouter;
