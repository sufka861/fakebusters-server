import express from "express";
import {  getResultById, createResult } from "../dal/lpaModel";
import {getAllResult} from "../controllers/lpaController"

const usersRouter = express.Router();

usersRouter.get("/", getAllResult);
usersRouter.get("/:id", getResultById);
usersRouter.post("/", createResult);

export default usersRouter;
