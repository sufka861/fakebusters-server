// s3Route.ts
import express from "express";
import {get_user } from "../controllers/twitterController";

const twitterRouter = express.Router();

twitterRouter.get("/user", get_user);

export default twitterRouter;
