import logger from "./loggers/errorLogger";
import { Request, Response } from "express";

interface CustomError extends Error {
  status: number;
  property?: string;
  entity?: string;
  action?: string;
}

const errorHandler = (error: CustomError, req: Request, res: Response) => {
  console.log(error);
  logger.error(error?.message);
  res.status(error.status || 500);
  res.json({ message: error.message || "Internal Server Error" });
};

export default errorHandler;
