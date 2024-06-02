import { ObjectId } from "mongodb";


export interface GraphData {
  _id?: ObjectId;
  nodes: Array<{ id: number; label: string; title: string }>;
  edges: Array<{ from: string; to: string }>;
  date_created: Date;
}

