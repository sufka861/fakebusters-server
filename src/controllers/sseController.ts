import { Request, RequestHandler, Response } from "express";

const handleSSE: RequestHandler = (req: Request, res: Response): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const requestId = req.query.requestId as string; // Ensure requestId is always of type string

  const intervalId = setInterval(() => {
    const data = JSON.stringify({ time: new Date().toISOString(), message: 'Processing' });
    res.write(`data: ${data}\n\n`);
  }, 20000); // Send an update every 20 seconds

  setTimeout(() => {
    clearInterval(intervalId); // Stop sending updates after 3 minutes
    const result = JSON.stringify({ time: new Date().toISOString(), message: 'Process completed' });
    res.write(`data: ${result}\n\n`);
    res.end(); // Close the connection
    // removeClient(requestId); // Cleanup client from the storage mechanism
  }, 180000); // Wait for 3 minutes before completing the process

  req.on("close", () => {
    clearInterval(intervalId); // Ensure the interval is cleared if the client disconnects
    removeClient(requestId, res); // Cleanup client from the storage mechanism
  });
};

export default handleSSE;

function removeClient(requestId: string, res: Response): void {
  // TODO: implement removeClient function to cleanup the client from the storage
  console.log(`Removing client with requestId: ${requestId}`);
}
