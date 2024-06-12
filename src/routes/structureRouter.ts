import express from "express";
import { handleFile,removeGraphs,editGraph,getGraph} from "../controllers/structureController"
import multer from "multer";

const upload = multer();
const graphRouter = express.Router();
graphRouter.post("/",upload.single("file"),handleFile);
graphRouter.delete("/", removeGraphs);
graphRouter.put('/:_id', editGraph);
graphRouter.get('/:_id', getGraph);

export default graphRouter;
