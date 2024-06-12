import { User } from "../models/users.model";
import { GenericDal } from "../repositories/mongo.repository";
import { Profile } from "../models/profile.model";
import { Result } from "../models/lpa.model";
import {GraphData} from "../models/graph.model"
import {Vocabulary} from "../models/vocabulary.model"

/* database connection */
const usersModel = new GenericDal<User>(process.env.USERS_COLLECTION_NAME || "");
const profileModel = new GenericDal<Profile>( process.env.PROFILES_COLLECTION_NAME || "");
const lpaModel = new GenericDal<Result>(process.env.LPA_COLLECTION_NAME || "");
const vocabularyModel = new GenericDal<Vocabulary>(process.env.VOC_COLLECTION_NAME || "");
const GraphDataModel = new GenericDal<GraphData>(process.env.GRAPH_COLLECTION_NAME || "");

export {usersModel,profileModel,lpaModel,vocabularyModel,GraphDataModel}