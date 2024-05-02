// s3Route.ts
import express from "express";
import { get_user_me, get_user} from '../controllers/twitterController';

const twitterRouter = express.Router();

twitterRouter.get("/user-me",get_user_me); 
twitterRouter.get("/user",get_user); 

export default twitterRouter;
