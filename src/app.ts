//app.ts
import 'express-async-errors';
import express, { Express } from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import sampleRoutes from './routes/sampleRoutes';
import errorHandler from './utils/errorHandler';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logPath = path.join(__dirname, '../logs', 'http.log');
app.use(
    logger(':date --> :method :url :status :response-time ms', {
        stream: fs.createWriteStream(logPath, { flags: 'a' }),
    }),
);
app.use(cors());

app.use('/api', sampleRoutes); 

app.use(errorHandler);

export default app;

