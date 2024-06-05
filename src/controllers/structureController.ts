import { GraphData } from '../models/graph.model';
import { exec } from 'child_process';
import { RequestHandler,Request,Response } from "express";
import path from 'path';
import { createGraph } from '../repositories/graph.repository';
import { parse } from 'csv-parse';


function fetchData(req:any, res: any) {
  const graphData = {
    nodes: [
      { id: 1, label: "1", title: "node 1 tooltip text" },
      { id: 2, label: "2", title: "node 2 tooltip text" },
      { id: 3, label: "3", title: "node 3 tooltip text" },
      { id: 4, label: "4", title: "node 4 tooltip text" },
      { id: 5, label: "5", title: "node 5 tooltip text" },
      { id: 6, label: "6", title: "node 6 tooltip text" }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 6, to: 1 },
      { from: 5, to: 6 }
    ]
  };
  console.log(graphData)
  res.json(graphData);
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
          await createGraph(graphData);
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
export {callPythonFunction,fetchData,handleFile}

