import { Request, Response, RequestHandler } from "express";
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

const getVocabulary: RequestHandler = async (req: Request, res: Response) => {
    try {
        const filter = req.query.body as string;
        const data = await getVocabularyByFilter({ filter});
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

export { removeVocabulary,getAllVocabularies,getVocabulary,addVocabulary };
