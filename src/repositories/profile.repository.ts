import { profileModel } from "../services/database.service";

const getProfiles = async () => {
  return await profileModel.getAll();
};

const getProfileById = async (id: string) => {
  return await profileModel.getById(id);
};

const getProfileByFilter = async (filter: any) => {
  return await profileModel.getByFilter(filter);
};

const createProfile = async (body: any) => {
  return await profileModel.create(body);
};

const deleteProfiles = async (filter: any = {}) => {
  return await profileModel.deleteMany(filter);
};


export {
  getProfiles,
  getProfileById,
  createProfile,
  getProfileByFilter,
  deleteProfiles,
};
