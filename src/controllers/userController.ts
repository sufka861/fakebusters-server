import { Request, Response, RequestHandler } from "express";
import { createUser, getUsers, deleteUser, getUserByFilter, updateUser } from "../repositories/users.repository";
import { ObjectId } from "mongodb";

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

const getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {_id} = req.params;    
        const o_id = new ObjectId(_id);
        const data = await getUserByFilter({_id:o_id});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const updateUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {_id} = req.params;    
        const o_id = new ObjectId(_id);
        console.log("o_id", o_id);
        console.log("req.body", req.body);
        
        const existingUser = await getUserByFilter({_id: o_id});
        let data;
        if (existingUser) {
            data = await updateUser(o_id, req.body);
        } else {
            data = await createUser(req.body);
        }
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


export {addUser, removeUser, getAllUsers, getUserById, updateUserById}