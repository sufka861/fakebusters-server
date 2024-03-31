// middleware/rawBodyBuffer.ts
import { Request, Response, NextFunction } from 'express';

const rawBodyBuffer = (req: Request, res: Response, next: NextFunction): void => {
    req.rawBody = '';
    req.setEncoding('binary');
    req.on('data', (chunk) => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
};

export default rawBodyBuffer;
