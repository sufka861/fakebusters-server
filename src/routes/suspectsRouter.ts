import express from "express";
import { getSuspectsByUser } from "../controllers/suspectsController";


const suspectRouter = express.Router();

suspectRouter.get("/:_id", getSuspectsByUser);



export default suspectRouter;
