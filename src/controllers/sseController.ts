import { Request, RequestHandler, Response } from "express";
import AWS from "aws-sdk";
import csv from "csv-parser";

AWS.config.update({
  accessKeyId: process.env.ACCESS_AWS_S3,
  secretAccessKey: process.env.SECRET_AWS,
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3();

interface CsvRecord {
  "Corpus 1": string;
  "Corpus 2": string;
  Value: string;
}

interface SockpuppetDetectionChartProps {
  data: {
    VeryLowLikelihood: number;
    LowLikelihood: number;
    MediumLikelihood: number;
    HighLikelihood: number;
  };
}

const calculateIdentityLikelihood = (
  records: CsvRecord[],
): SockpuppetDetectionChartProps => {
  let likelihoodCategories = {
    VeryLowLikelihood: 0,
    LowLikelihood: 0,
    MediumLikelihood: 0,
    HighLikelihood: 0,
  };

  records.forEach((record) => {
    const value = parseFloat(record.Value);
    if (value < 0.25) {
      likelihoodCategories.HighLikelihood++;
    } else if (value < 0.5) {
      likelihoodCategories.MediumLikelihood++;
    } else if (value < 0.75) {
      likelihoodCategories.LowLikelihood++;
    } else {
      likelihoodCategories.VeryLowLikelihood++;
    }
  });

  return { data: likelihoodCategories };
};

// Store active SSE connections
const clients: Map<string, Response> = new Map();

const handleSSE: RequestHandler = (req: Request, res: Response): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const fileName = req.query.fileName as string;
  // TODO: send client ID to AWS
  if (!fileName) {
    res.write('data: {"error": "No fileName provided"}\n\n');
    res.end();
    return;
  }

  clients.set(fileName, res);

  req.on("close", () => {
    clients.delete(fileName);
    res.end();
  });
};

const notify_SSE: RequestHandler = (req: Request, res: Response) => {
  const { bucketName, fileName } = req.body;

  if (!fileName || !clients.has(fileName)) {
    res.status(400).send('Invalid fileName or client not connected');
    return;
  }

  try {
    const params = { Bucket: bucketName, Key: fileName };
    const csvFile = s3.getObject(params).createReadStream();
    const records: CsvRecord[] = [];

    csvFile
      .pipe(csv())
      .on("data", (data: CsvRecord) => records.push(data))
      .on("end", () => {
        const sockpuppetData = calculateIdentityLikelihood(records);
        const result = JSON.stringify({
          time: new Date().toISOString(),
          message: "Process completed",
          resultsLPA: records,
          sockpuppetData: sockpuppetData.data,
        });

        const client = clients.get(fileName);
        if (client) {
          client.write(`data: ${result}\n\n`);
        }

        res.status(200).send("Notification received and data sent to client");
      })
      .on("error", (error: unknown) => {
        const client = clients.get(fileName);
        if (client) {
          if (error instanceof Error) {
            client.write(
              `data: ${JSON.stringify({ time: new Date().toISOString(), error: "Error processing file: " + error.message })}\n\n`,
            );
          } else {
            client.write(
              `data: ${JSON.stringify({ time: new Date().toISOString(), error: "Unknown error occurred" })}\n\n`,
            );
          }
        }

        res.status(500).send("Error processing notification");
      });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).send(`Error processing notification: ${error.message}`);
    } else {
      res.status(500).send("Unknown error occurred");
    }
  }
};

export { handleSSE, notify_SSE };
