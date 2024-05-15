import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { RequestHandler } from "express";
import { GenericDAL } from "./genericDal";

interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

const usersDAL = new GenericDAL<User>(process.env.USERS_COLLECTION_NAME || "");

const getUsers: RequestHandler = async (_req: Request, res: Response) => {
  try {
    const users = await usersDAL.getAll();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const getUserById: RequestHandler = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const user = await usersDAL.getById(id);
    if (user) {
      console.log(res);
      res.status(200).send(user);
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
};

const createUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const newUser = await usersDAL.create({
      name: "John Doe",
      email: "john@example.com",
    });
    newUser
      ? res
          .status(201)
          .send(`Successfully created a new game with id ${newUser._id}`)
      : res.status(500).send("Failed to create a new game.");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export { getUsers, getUserById, createUser };
