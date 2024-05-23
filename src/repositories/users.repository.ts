import { usersModel } from "../services/database.service";

const getUsers = async () => {
    console.log(await usersModel.getAll());
};

const getUserById = async(id: string) => {
    return await usersModel.getById(id);
};

const createUser = async (body: any) => {
    return await usersModel.create(body);

};

export { getUsers, getUserById, createUser };
