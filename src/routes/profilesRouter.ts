import express from "express";

import {removeProfiles, getAllProfiles, getProfileByUsername,createNewProfile,getProfileByErrorUsername} from "../controllers/profilesController"


const usersRouter = express.Router();

usersRouter.get("/", getAllProfiles);
usersRouter.get("/profile", getProfileByUsername);
usersRouter.get("/error", getProfileByErrorUsername);
usersRouter.post("/", createNewProfile);
usersRouter.delete("/", removeProfiles);

export default usersRouter;
