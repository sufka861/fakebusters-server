import { Request, Response, RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { deleteVocabulary, getVocabularyByFilter, getVocabularies, createVocabulary } from "../repositories/vocabulary.repository";

const removeVocabulary: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteVocabulary(req.body);
        res.status(200).send("profiles have been deleted");
    } catch (err) {
        res.status(400).send(err);
    }
};
const getAllVocabularies: RequestHandler = async (req: Request, res: Response) => {
    try {
        const data = await getVocabularies();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getVocabularyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {_id} = req.params;    
        const o_id = new ObjectId(_id);
        const data = await getVocabularyByFilter({ _id: o_id});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const getVocabularyByUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {createdBy} = req.params;
        const data = await getVocabularyByFilter({ createdBy: createdBy});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const getDefaultVocabularyByUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {createdBy} = req.params;
        const filter = { 
            createdBy: createdBy, 
            is_default: true 
        };
        const data = await getVocabularyByFilter(filter);
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

const addVocabulary: RequestHandler = async (req: Request, res: Response) => {
    try {
        const newVoc = req.body;
        const data = await createVocabulary( newVoc );
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};

export { removeVocabulary,getAllVocabularies,getVocabularyById,addVocabulary,getVocabularyByUser,getDefaultVocabularyByUser };
