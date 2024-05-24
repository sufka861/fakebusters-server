// s3Route.ts
import express from "express";
import { handleNewProject, handleMail } from "../controllers/s3Controller";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const s3Router = express.Router();

s3Router.post("/Preprocessing", upload.array("files", 10), handleNewProject);
s3Router.post("/mail", handleMail); //Temporary path for testing
export default s3Router;
