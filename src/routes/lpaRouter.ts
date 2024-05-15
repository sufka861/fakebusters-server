import express from "express";
import { getResults, getResultById, createResult } from "../dal/lpaModel";

const usersRouter = express.Router();

usersRouter.get("/", getResults);
usersRouter.get("/:id", getResultById);
usersRouter.post("/", createResult);

export default usersRouter;
