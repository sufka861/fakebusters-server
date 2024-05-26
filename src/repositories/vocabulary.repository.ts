import { vocabularyModel } from "../services/database.service";

const getVocabularies = async () => {
  return await vocabularyModel.getAll();
};

const getVocabularyByFilter = async (filter: any) => {
  return await vocabularyModel.getByFilter(filter);
};

const getOneVocabularyByFilter = async (filter: any) => {
  return await vocabularyModel.getOneByFilter(filter);
};

const createVocabulary = async (body: any) => {
  const date = new Date();
  body.date_modified = date;
  return await vocabularyModel.create(body);
};

const deleteVocabulary = async (filter: any = {}) => {
  return await vocabularyModel.deleteMany(filter);
};

const updateVocabulary = async (id: {}, params: {}) => {
  const updateParams = { $set: params };
  return await vocabularyModel.updateById(id, updateParams);
};

export {
  getVocabularies,
  getVocabularyByFilter,
  createVocabulary,
  deleteVocabulary,
  getOneVocabularyByFilter,
  updateVocabulary,
};
