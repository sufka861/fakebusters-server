import { Request, Response, RequestHandler } from "express";
import { createProfile, deleteProfiles, getProfileByFilter, getProfiles } from "../repositories/profile.repository";

const removeProfiles: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteProfiles(req.body);
        res.status(200).send("profiles have been deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};
const getAllProfiles: RequestHandler = async (req: Request, res: Response) => {
    try {
        const data = await getProfiles();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getProfileByUsername: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {username} = req.query;
        let data = await getProfileByFilter({ 'data.username': String(username)});
        if (data.length <1){
            data = await getProfileByFilter({ 'errors.value': String(username)});
        }
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};
const getProfileByErrorUsername: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {username} = req.query;
        const data = await getProfileByFilter({ 'errors.value': String(username)});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const createNewProfile: RequestHandler = async (req: Request, res: Response) => {
    try {
        const profile = req.body;
        const data = await createProfile(profile);
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

export { removeProfiles,getAllProfiles,getProfileByUsername,createNewProfile,getProfileByErrorUsername };
