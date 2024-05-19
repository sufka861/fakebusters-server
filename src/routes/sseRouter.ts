// src/routes/sseRouter.ts
import express from "express";
import { handleSSE, notify_SSE } from "../controllers/sseController";

const sseRouter = express.Router();

sseRouter.get("/lpa-results", handleSSE);
sseRouter.post("/notify_SSE", notify_SSE);

export default sseRouter;
