import express from "express";
import { getUsers, getUserById, createUser } from "../repositories/users.repository";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", createUser);

export default usersRouter;
