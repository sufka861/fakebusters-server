// src/types/express.d.ts

declare global {
    namespace Express {
      interface Request {
        rawBody: string;
      }
    }
  }
  
  export {};
  