// s3Route.ts
import express from 'express';
import { uploadFileToS3 } from '../controllers/s3Controller';
import rawBodyBuffer from '../middleware/rawBodyBuffer';

const s3Router = express.Router();

s3Router.put('/upload-csv', rawBodyBuffer, uploadFileToS3);

export default s3Router;
