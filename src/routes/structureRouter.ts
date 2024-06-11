import express from "express";
import { handleFile,removeGraphs} from "../controllers/structureController"
import multer from "multer";

const upload = multer();
const graphRouter = express.Router();
graphRouter.post("/",upload.single("file"),handleFile);
graphRouter.delete("/", removeGraphs);

export default graphRouter;
