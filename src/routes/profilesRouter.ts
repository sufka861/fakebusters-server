import express from "express";

import {removeProfiles, getAllProfiles, getProfileByUsername,createNewProfile} from "../controllers/profilesController"


const usersRouter = express.Router();

usersRouter.get("/", getAllProfiles);
usersRouter.get("/:name", getProfileByUsername);
usersRouter.post("/", createNewProfile);
usersRouter.delete("/", removeProfiles);

export default usersRouter;
