import express from "express";
import { getSuspects,getStructureSuspects } from "../controllers/suspectsController";


const suspectRouter = express.Router();
/* LPA sockpuppets */
suspectRouter.get("/:_id", getSuspects);
/* Structure sockpuppets */
suspectRouter.get("/structure/:_id", getStructureSuspects);



export default suspectRouter;
