
import { RequestHandler } from "express";
import { getResults } from "../dal/lpaModel";


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

  
  export { getAllResult };