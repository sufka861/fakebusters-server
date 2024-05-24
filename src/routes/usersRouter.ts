import express from "express";
import { getAllUsers, getUserById, addUser } from "../controllers/userController";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:_id", getUserById);
usersRouter.post("/", addUser);

export default usersRouter;
