// s3Route.ts
import express from "express";
import { uploadFileToS3, handlePreprocessing, handleReadResult } from "../controllers/s3Controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const s3Router = express.Router();

s3Router.put("/upload-csv", upload.single("posts-csv-file"), uploadFileToS3); // TODO: make 'file' name dynamic
s3Router.post("/Preprocessing",upload.single('file'), handlePreprocessing); 
s3Router.get("/result/:fileName", handleReadResult);

export default s3Router;
