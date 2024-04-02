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
    // TODO: Implement client.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  res.status(200).end();
};

function getClient(requestId: string): string {
  // TODO: implement: getClient(requestId);
  console.log(`getClient with requestId: ${requestId}`);
  return requestId;
}
export default handleLPAResults;
