
import { RequestHandler } from "express";
import { createResult, deleteResults, getResults,getResultsByFilter,updateResults } from "../repositories/lpa.repository";

const removeResults: RequestHandler = async (req, res) => {
  try {
      await deleteResults(); 
      res.status(200).send("All results have been deleted");
  } catch (err) {
      res.status(400).send(err);
  }
};

const getAllResult: RequestHandler = async (req, res) => {
    try {
      console.log("all result")
      const resultList = await getResults(); 
      res.status(200).send(resultList)
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };
  
  const getResultsByProjectId: RequestHandler = async (req, res) => {
    try {
        const {project_id} = req.params;    
        const data = await getResultsByFilter({ project_id: project_id});
        res.status(200).send(data);
    } catch (err: any) { 
        res.status(400).send(err.message);
    }
};


const addResult: RequestHandler = async (req, res) => {
  try {
      const result = req.body;
      const data = await createResult(result);
      res.status(200).send(data);
  } catch (err: any) { 
      res.status(400).send(err.message);
  }
};

const editResultsByProjectid: RequestHandler = async (req, res) => {
  try {
    const {
      params: { project_id },
      body,
    } = req;
    const data = await updateResults({ project_id: project_id }, body);
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};


  export { getAllResult ,removeResults,getResultsByProjectId,addResult,editResultsByProjectid};


