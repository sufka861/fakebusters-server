import { ObjectId } from "mongodb";


export interface GraphData {
  _id?: ObjectId;
  nodes: Array<{ id: number; label: string; title: string }>;
  edges: Array<{ from: string; to: string }>;
  adj_results: Array<{ node1: string; node2: string, similarity: number }>;
  date_created: Date;
  file_name : String;
  project_name : String;
}

