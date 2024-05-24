import express from "express";
import {removeResults, getAllResult,getResultsByProjectId,addResult} from "../controllers/lpaController"

const usersRouter = express.Router();

usersRouter.get("/", getAllResult);
usersRouter.get("/:project_id", getResultsByProjectId);
usersRouter.post("/", addResult);
usersRouter.delete("/", removeResults);

export default usersRouter;
