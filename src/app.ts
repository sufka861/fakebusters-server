//app.ts
import "express-async-errors";
import express, { Express } from "express";
import logger from "morgan";
import cors from "cors";
import path from "path";
import fs from "fs";
import s3Router from "./routes/s3Router";
import webhookRouter from "./routes/webhookRouter";
import sseRouter from "./routes/sseRouter";
// import errorHandler from './utils/errorHandler';
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logPath = path.join(__dirname, "../logs", "http.log");
app.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
app.use(cors());

app.use("/api/s3/", s3Router);
app.use("/api/webhook/", webhookRouter);
app.use("/api/sse/", sseRouter);

// app.use(errorHandler);

export default app;
