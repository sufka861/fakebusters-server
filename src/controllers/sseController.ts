import { Request, RequestHandler, Response } from "express";
import fs from 'fs';
import csv from 'csv-parser';

interface CsvRecord {
  'Corpus 1': string;
  'Corpus 2': string;
  value: number; 
}

const handleSSE: RequestHandler = (req: Request, res: Response): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  const requestId = req.query.requestId as string;
  const intervalId = setInterval(() => {
    const data = JSON.stringify({ time: new Date().toISOString(), message: 'Processing' });
    res.write(`data: ${data}\n\n`);
  }, 10000); // Send an update every 20 seconds

  setTimeout(() => {
    clearInterval(intervalId); // Stop sending updates after 30 seconds

    const results: CsvRecord[] = [];
    fs.createReadStream('src/python/data/filtered_spd_results.csv')
      .pipe(csv())
      .on('data', (data: CsvRecord) => results.push(data))
      .on('end', () => {

        const sockpuppetData = calculateRiskCategories(results);
        const result = JSON.stringify({
            time: new Date().toISOString(), 
            message: 'Process completed', 
            resultsLPA: results,
            sockpuppetData: sockpuppetData.data
        });
        res.write(`data: ${result}\n\n`);
        res.end();
      });
  }, 30000); // Wait for 30 seconds before completing the process

  req.on("close", () => {
    clearInterval(intervalId); // Ensure the interval is cleared if the client disconnects
    removeClient(requestId, res); // Cleanup client from the storage mechanism
  });
};


function removeClient(requestId: string, res: Response): void {
  console.log(`Removing client with requestId: ${requestId}`);
}

interface SockpuppetDetectionChartProps {
  data: {
      VeryHighRisk: number;
      HighRisk: number;
      MediumRisk: number;
      LowRisk: number;
  };
}

//Add a Python version to the code running in EC2 and get the data ready
const calculateRiskCategories = (records: CsvRecord[]): SockpuppetDetectionChartProps => {
  let riskCategories = {
      VeryHighRisk: 0,
      HighRisk: 0,
      MediumRisk: 0,
      LowRisk: 0
  };

  records.forEach(record => {
      if (record.value >= 0.75) {
          riskCategories.VeryHighRisk++;
      } else if (record.value >= 0.5) {
          riskCategories.HighRisk++;
      } else if (record.value >= 0.25) {
          riskCategories.MediumRisk++;
      } else {
          riskCategories.LowRisk++;
      }
  });

  return { data: riskCategories };
};


export default handleSSE;