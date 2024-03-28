// src/routes/sampleRoutes.ts
import express from 'express';
import { getSamples, createSample } from '../controllers/sampleController';

const router = express.Router();

router.get('/samples', getSamples);
router.post('/samples', createSample);

export default router;
