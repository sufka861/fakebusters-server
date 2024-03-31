// s3Route.ts
import express from 'express';
import { uploadFileToS3 } from '../controllers/s3Controller';
// import rawBodyBuffer from '../middleware/rawBodyBuffer';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const s3Router = express.Router();

s3Router.put('/upload-csv', upload.single('file'), uploadFileToS3);

export default s3Router;
