import express from "express";
import { getAllUsers, getUser, addUser } from "../controllers/userController";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:by", getUser);
usersRouter.post("/", addUser);

export default usersRouter;
