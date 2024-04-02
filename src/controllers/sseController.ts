import { Request, RequestHandler, Response } from "express";

const handleSSE: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const requestId = req.query.requestId as string; // Ensure requestId is always of type string
  // TODO: implement addClient to store the client to later be sent the result: addClient(requestId, res);

  req.on("close", () => removeClient(requestId, res));
};

export default handleSSE;

function removeClient(requestId: string, res: Response): void {
  // TODO: implement: removeClient(requestId);
  console.log(`Removing client with requestId: ${requestId}`);
}
