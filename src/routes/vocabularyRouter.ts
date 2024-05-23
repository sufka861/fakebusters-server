import express from "express";
import {getAllVocabularies, getVocabulary, removeVocabulary, addVocabulary} from "../controllers/vocabularyController"

const usersRouter = express.Router();

usersRouter.get("/", getAllVocabularies);
usersRouter.get("/:name", getVocabulary);
usersRouter.post("/", addVocabulary);
usersRouter.delete("/", removeVocabulary);

export default usersRouter;
