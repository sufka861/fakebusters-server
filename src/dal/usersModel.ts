import { ObjectId } from "mongodb";
import { GenericDAL } from "./genericDal";

interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  analysis_id: string[]
}

const usersDAL = new GenericDAL<User>(process.env.USERS_COLLECTION_NAME || "");

const getUsers = async () => {
    console.log(await usersDAL.getAll());
};

const getUserById = async(id: string) => {
    return await usersDAL.getById(id);
};

const createUser = async (body: any) => {
    return await usersDAL.create(body);

};

export { getUsers, getUserById, createUser };
