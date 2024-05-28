import express from "express";

import {removeProfiles, getAllProfiles, getProfileByUsername,createNewProfile,getProfileByErrorUsername} from "../controllers/profilesController"


const profilesRouter = express.Router();

profilesRouter.get("/", getAllProfiles);
profilesRouter.get("/profile", getProfileByUsername);
profilesRouter.get("/error", getProfileByErrorUsername);
profilesRouter.post("/", createNewProfile);
profilesRouter.delete("/", removeProfiles);

export default profilesRouter;
