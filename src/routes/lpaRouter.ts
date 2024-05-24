import express from "express";


import { getResultById, createResult } from "../repositories/lpa.repository";
import {removeResults, getAllResult} from "../controllers/lpaController"


const usersRouter = express.Router();

usersRouter.get("/", getAllResult);
usersRouter.get("/:id", getResultById);
usersRouter.post("/", createResult);
usersRouter.delete("/", removeResults);


export default usersRouter;
