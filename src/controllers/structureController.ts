import { GraphData } from '../models/graph.model';
import { RequestHandler,Request,Response } from "express";
import { createGraph, deleteGraphs,getGraphById,updateGraph } from '../repositories/graph.repository';
import { parse } from 'csv-parse';
import { ObjectId } from 'mongodb';



const removeGraphs: RequestHandler = async (req, res) => {
  try {
      await deleteGraphs(); 
      res.status(200).send("All graph results have been deleted");
  } catch (err) {
      res.status(400).send(err);
  }
};

const handleFile: RequestHandler = async (req: Request, res: Response) => {
  try {
      if (!req.file) {
          return res.status(400).send("No files uploaded.");
      }
      const fileBuffer = req.file.buffer; // Access the file buffer
      const parser = parse(fileBuffer, { columns: true });
      const nodesMap: { [key: string]: number } = {};
      const nodes: Array<{ id: number; label: string; title: string }> = [];
      const edges: Array<{ from: string; to: string }> = [];
      let currentId = 1;
      const adj_results =[{node1:"",node2:"",similarity:0}]
      const file_name = "";
      const project_name="";

      for await (const record of parser) {
          const { id, target_user_id } = record;

          if (!(id in nodesMap)) {
              nodesMap[id] = currentId++;
              nodes.push({ id: id, label: id, title: id });
          }

          if (!(target_user_id in nodesMap)) {
              nodesMap[target_user_id] = currentId++;
              nodes.push({ label: target_user_id, id: target_user_id,title: target_user_id });
          }

          edges.push({ from: id, to: target_user_id });
      }

      const graphData: GraphData = { nodes, edges, date_created: new Date(),adj_results, file_name,project_name };
      
      try {
          const new_graph = await createGraph(graphData);
          graphData._id = new_graph._id
          return res.json(graphData);
      } catch (err) {
          console.error('Error saving graph data:', err);
          return res.status(500).send('Error saving graph data.');
      } 
  } catch (error) {
      console.error('Error handling file upload:', error);
      return res.status(500).send('Internal Server Error');
  }
};


const editGraph: RequestHandler = async (req, res) => {
    try {
      const {
        params: { _id },
        body,
      } = req;
      const o_id = new ObjectId(_id);
      const data = await updateGraph({ _id: o_id }, body);
      res.status(200).send(data);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };

  const getGraph: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { _id } = req.params;
      const data = await getGraphById(_id);
      res.status(200).send(data);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  };
  
export {handleFile,removeGraphs,editGraph,getGraph}


