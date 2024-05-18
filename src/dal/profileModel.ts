import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { RequestHandler } from "express";
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

const getProfiles = async (_req: Request, res: Response) => {
  try {
    const profiles = await profileDAL.getAll();
    res.status(200).send(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const getProfileById: RequestHandler = async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const profile = await profileDAL.getById(id);
    if (profile) {
      console.log(res);
      res.status(200).send(profile);
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching profile with id: ${req.params.id}`);
  }
};

const getProfileByUsername = async (username: string) => {
  try {
    const profile = await profileDAL.getByFilter({username: username});
    if (profile) {
      return profile;
    }
    else {return null;}
  } catch (error) {
    return null; 
  }
};

const createProfile: RequestHandler = async (req: Request, res: Response) => {
  try {
    const newProfile = await profileDAL.create(req.body);
    newProfile
      ? res
          .status(201)
          .send(`Successfully created a new profile with id ${newProfile._id}`)
      : res.status(500).send("Failed to create a new profile.");
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export { getProfiles, getProfileById, createProfile,getProfileByUsername };
