import express from "express";
import {fetchData, handleFile} from "../controllers/structureController"
import multer from "multer";

const upload = multer();
const graphRouter = express.Router();
graphRouter.get("/", fetchData);
graphRouter.post("/",upload.single("file"),handleFile);


export default graphRouter;
