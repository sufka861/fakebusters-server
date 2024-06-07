import { lpaModel } from "../services/database.service";

const getResults = async () => {
  return await lpaModel.getAll();
};

const getResultById = async ( id: string) => {
    return await lpaModel.getById(id);
};

const createResult = async (body: any) => {
  body.date_created= new Date();
    return await lpaModel.create(body);
};
const deleteResults = async (filter: any ={}) => {
    return await lpaModel.deleteMany(filter);
  };
  const getResultsByFilter = async (filter: any) => {
    return await lpaModel.getByFilter(filter);
  };

  const updateResults = async (file_id: {}, params: {}) => {
    console.log("INSIDE updateResults");
    console.log("file_id", file_id);
    console.log("params", params);
    
    const updateParams = { $set: params };
    return await lpaModel.updateByFilter(file_id, updateParams);
  };

export { getResults, getResultById, createResult,deleteResults,getResultsByFilter,updateResults };

