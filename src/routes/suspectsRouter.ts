import express from "express";
import { getSuspects } from "../controllers/suspectsController";


const suspectRouter = express.Router();

suspectRouter.get("/:_id", getSuspects);



export default suspectRouter;
