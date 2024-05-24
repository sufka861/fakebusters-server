// s3Route.ts
import express from "express";
import { handleNewProject, handleMail, handlePreprocessing } from "../controllers/s3Controller";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const s3Router = express.Router();
handlePreprocessing
s3Router.post("/newProject", upload.array("files", 10), handleNewProject);
s3Router.post("/Preprocessing", handlePreprocessing);

s3Router.post("/mail", handleMail); //Temporary path for testing
export default s3Router;
