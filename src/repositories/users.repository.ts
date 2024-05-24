import { usersModel } from "../services/database.service";

const getUsers = async () => {
    console.log(await usersModel.getAll());
};

const getUserByFilter = async(filter: any) => {
    return await usersModel.getByFilter(filter);
};

const deleteUser = async (body: any) => {
    return await usersModel.deleteMany(body);

};
const createUser = async (body: any) => {
    return await usersModel.create(body);

};

export { getUsers, getUserByFilter, createUser,deleteUser };
