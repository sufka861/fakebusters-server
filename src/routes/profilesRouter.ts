import express from "express";
import {
  getProfiles,
  getProfileById,
  createProfile,
} from "../dal/profileModel";
import {deleteAllProfiles} from "../controllers/profilesController"


const usersRouter = express.Router();

usersRouter.get("/", getProfiles);
usersRouter.get("/:id", getProfileById);
usersRouter.post("/", createProfile);
usersRouter.delete("/", deleteAllProfiles);

export default usersRouter;
