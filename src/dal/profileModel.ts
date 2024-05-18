import { ObjectId } from "mongodb";
import { GenericDAL } from "./genericDal";

interface Profile {
  _id?: ObjectId;
  twitter_id: string;
  username: string;
  created_at: Date;
  location: string;
  profile_image_url: string;
  verified_type: string;
  description: string;
  verified: string;
  url: string;
  name: string;
  public_metrics: object;
}

const profileDAL = new GenericDAL<Profile>(
  process.env.PROFILES_COLLECTION_NAME || "",
);

const getProfiles = async () => {
    return await profileDAL.getAll();
};

const getProfileById = async (id: string) => {
    return await profileDAL.getById(id);
};

const getProfileByUsername = async (username: string) => {
    return await profileDAL.getByFilter({ username: username });
};

const createProfile = async (body: any) => {
    return await profileDAL.create(body);
};

export { getProfiles, getProfileById, createProfile, getProfileByUsername };
