import { ObjectId } from "mongodb";

export interface Vocabulary {
  _id?: ObjectId;
  name: string;   // name of vocabulary
  terms: string[];  // words in vocabulary
  createdBy: ObjectId; // User ID of the user who added this word
  is_default: boolean;
}
