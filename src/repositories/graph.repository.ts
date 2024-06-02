import { GraphDataModel } from "../services/database.service";

const getGraphs = async () => {
  return await GraphDataModel.getAll();
};

const getGraphById = async (id: string) => {
  return await GraphDataModel.getById(id);
};

const getGraphByFilter = async (filter: any) => {
  return await GraphDataModel.getByFilter(filter);
};


const createGraph= async (body: any) => {
  return await GraphDataModel.create(body);
};

const deleteGraphs = async (filter: any = {}) => {
  return await GraphDataModel.deleteMany(filter);
};


export {
  getGraphs,
  getGraphById,
  getGraphByFilter,
  createGraph,
  deleteGraphs
};
