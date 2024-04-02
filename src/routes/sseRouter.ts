// src/routes/sseRouter.ts
import express from "express";
import handleSSE from "../controllers/sseController";

const sseRouter = express.Router();

sseRouter.get("/lpa-results", handleSSE);

export default sseRouter;
