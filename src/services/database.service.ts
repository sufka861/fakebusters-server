import { User } from "../models/users.model";
import { GenericDal } from "../repositories/mongo.repository";
import { Profile } from "../models/profile.model";
import { Result } from "../models/lpa.model";

/* database connection */
const usersModel = new GenericDal<User>(process.env.USERS_COLLECTION_NAME || "");
const profileModel = new GenericDal<Profile>( process.env.PROFILES_COLLECTION_NAME || "");
const lpaModel = new GenericDal<Result>(process.env.LPA_COLLECTION_NAME || "");
const vocabularyModel = new GenericDal<Result>(process.env.VOC_COLLECTION_NAME || "");

export {usersModel,profileModel,lpaModel,vocabularyModel}