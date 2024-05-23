import { lpaModel } from "../services/database.service";

const getResults = async () => {
  return await lpaModel.getAll();
};

const getResultById = async ( id: string) => {
    return await lpaModel.getById(id);
};

const createResult = async (body: any) => {
    return await lpaModel.create(body);
};
const deleteResults = async (filter: any ={}) => {
    return await lpaModel.deleteMany(filter);
  };

export { getResults, getResultById, createResult,deleteResults };

