
import { RequestHandler } from "express";
import { deleteResults, getResults } from "../repositories/lpa.repository";

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
      const resultList = await getResults(); 
      console.log(resultList);
      res.status(200).send(resultList)
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };
  
  export { getAllResult ,removeResults};