// src/controllers/webhookController.ts
import { Request, RequestHandler, Response } from 'express';

export const handleLPAResults: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const results = req.body;

    // validate the request here (e.g., check a signature header)
    console.log("Received Lambda results: ", results);
    res.status(200).send('Received');
};
