import express from "express";
import {removeResults, getAllResult,getResultsByProjectId,addResult} from "../controllers/lpaController"


const lpaRouter = express.Router();

lpaRouter.get("/", getAllResult);
lpaRouter.get("/:project_id", getResultsByProjectId);
lpaRouter.post("/", addResult);
lpaRouter.delete("/", removeResults);


export default lpaRouter;
