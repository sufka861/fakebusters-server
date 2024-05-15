import express from "express";
import {
  getProfiles,
  getProfileById,
  createProfile,
} from "../dal/profileModel";

const usersRouter = express.Router();

usersRouter.get("/", getProfiles);
usersRouter.get("/:id", getProfileById);
usersRouter.post("/", createProfile);

export default usersRouter;
