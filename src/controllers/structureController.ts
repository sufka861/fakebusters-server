import { GraphData } from '../models/graph.model';
import { exec } from 'child_process';
import { RequestHandler,Request,Response } from "express";
import path from 'path';
import { createGraph, deleteGraphs } from '../repositories/graph.repository';
import { parse } from 'csv-parse';



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

      const graphData: GraphData = { nodes, edges, date_created: new Date() };
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


function callPythonFunction(req: any,res:any) {
    // Execute the Python script with the input data
    const pythonScript = path.resolve(process.cwd(), 'src', 'python', "Structure.py");
    exec(`python ${pythonScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Python script error: ${stderr}`);
            return;
        }
        // Parse the JSON output from the Python script
        const graph_image = path.resolve(process.cwd(), "src", "python", "graphs", "undirected_graph.png");
        res.sendFile(graph_image);
    });
}

// Call the function with an example input
export {callPythonFunction,handleFile,removeGraphs}

