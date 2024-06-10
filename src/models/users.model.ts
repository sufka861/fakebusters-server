import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  project_id: Object[];
  default_vocabulary: ObjectId;
}
