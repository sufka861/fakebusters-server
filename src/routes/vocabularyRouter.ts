import express from "express";
import {
  getAllVocabularies,
  getVocabularyById,
  removeVocabulary,
  addVocabulary,
  getVocabularyByUser,
  getDefaultVocabularyByUser,
  addDefaultVocabulary,
} from "../controllers/vocabularyController";

const usersRouter = express.Router();

usersRouter.get("/", getAllVocabularies);
usersRouter.get("/:_id", getVocabularyById);
usersRouter.get("/vocabulary/:createdBy", getVocabularyByUser);
usersRouter.get("/vocabularyDefault/:createdBy", getDefaultVocabularyByUser);
usersRouter.post("/", addVocabulary);
usersRouter.post("/default", addDefaultVocabulary);
usersRouter.delete("/", removeVocabulary);

export default usersRouter;
