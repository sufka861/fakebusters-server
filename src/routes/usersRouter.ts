import express from "express";
import { getAllUsers, getUserById, addUser, updateUserById } from "../controllers/userController";

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:_id", getUserById);
usersRouter.put("/:_id", updateUserById);
usersRouter.post("/", addUser);

export default usersRouter;
