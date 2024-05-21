import { Request, Response, RequestHandler } from "express";
import { deleteProfiles } from "../dal/profileModel";

const deleteAllProfiles: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteProfiles();
        res.status(200).send("All profiles have been deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};

export { deleteAllProfiles };
