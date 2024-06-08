import { usersModel } from "../services/database.service";

const getUsers = async () => {
    return await usersModel.getAll();
};

const getUserByFilter = async(filter: any) => {
    console.log(filter)
    return await usersModel.getByFilter(filter);
};

const deleteUser = async (body: any) => {
    return await usersModel.deleteMany(body);

};
const createUser = async (body: any) => {
    return await usersModel.create(body);

};

export { getUsers, getUserByFilter, createUser,deleteUser };
