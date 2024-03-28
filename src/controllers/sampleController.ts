// src/controller/sampleController.ts
import { Request, Response } from "express";

const getSamples = (req: Request, res: Response): void => {
  res.status(200).send("GET request to the homepage");
};

const createSample = (req: Request, res: Response): void => {
  res.status(201).json({
    message: "POST request to create a sample",
    requestBody: req.body,
  });
};

export { getSamples, createSample };