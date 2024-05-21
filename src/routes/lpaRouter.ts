import express from "express";
import { getResults, getResultById, createResult } from "../dal/lpaModel";
import {getAllResult} from "../controllers/lpaController"

const usersRouter = express.Router();

usersRouter.get("/", getResults);
usersRouter.get("/:id", getResultById);
usersRouter.post("/", createResult);
usersRouter.get("/result-list", getAllResult);

export default usersRouter;
