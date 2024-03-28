import { Request, Response } from 'express';

const morgan = require('morgan');

interface MorganTokens {
    date: (format?: string) => string;
    method: (req: Request, res: Response) => string;
    url: (req: Request, res: Response) => string;
    status: (req: Request, res: Response) => string;
    ['response-time']: (req: Request, res: Response) => string;
  }

morgan((tokens: MorganTokens, req: Request, res: Response) => {
    return [
        tokens.date(),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});

module.exports = {
    morgan,
};