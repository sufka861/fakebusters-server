// s3Route.ts
import express from "express";
import { handlePreprocessing } from "../controllers/s3Controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const s3Router = express.Router();

s3Router.post("/Preprocessing",upload.array('files', 10), handlePreprocessing); 

export default s3Router;
