// src/controllers/webhookController.ts
import { Request, RequestHandler, Response } from "express";

const handleLPAResults: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestId, data } = req.body; // TODO: Lambda includes requestId in the payload

  // Send data to the client associated with requestId
  const client = getClient(requestId);
  if (client) {
    console.log(data);
    // TODO: Implement send data to client via sse- client.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  const sendEvent = () => {
    const job = requestId[requestId];
    if (job) {
        res.write(`data: ${JSON.stringify(job)}\n\n`);

        if (job.status === 'completed') {
  
            res.end();
            return;
        }
    } else {
 
        res.write('data: {"error": "Job not found"}\n\n');
        res.end();
    }


    setTimeout(sendEvent, 1000); 
};

sendEvent();












  res.status(200).end();
};

function getClient(requestId: string): string {
  // TODO: implement: getClient(requestId);
  console.log(`getClient with requestId: ${requestId}`);
  return requestId;
}
export default handleLPAResults;

