import { Request, Response, RequestHandler } from "express";
import { createUser, getUsers, deleteUser, getUserByFilter } from "../repositories/users.repository";

const removeUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteUser(req.body);
        res.status(200).send("profiles have been deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};
const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const data = await getUsers();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string;
        const data = await getUserByFilter({name});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const addUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const newVoc = req.body;
        const data = await createUser( newVoc );
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};


export {addUser, removeUser, getAllUsers, getUser}