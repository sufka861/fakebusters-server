// src/routes/webhookRouter.ts
import express from 'express';
import { handleLPAResults } from '../controllers/webhookController';

const webhookRouter = express.Router();

webhookRouter.post('/lpa-results', handleLPAResults);

export default webhookRouter;
