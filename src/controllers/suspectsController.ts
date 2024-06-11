import { RequestHandler } from "express";
import { getUserByFilter } from "../repositories/users.repository";
import { ObjectId } from "mongodb";
import AWS from "aws-sdk";
import csv from 'csv-parser';

type Result = {
  "Corpus 1": string,
  "Corpus 2": string,
  "value": number
};


AWS.config.update({
  accessKeyId: process.env.ACCESS_AWS_S3,
  secretAccessKey: process.env.SECRET_AWS,
  region: process.env.S3_REGION,
});

const S3 = new AWS.S3();
const bucketName = process.env.S3_NAME_BUCKET;

if (!bucketName) {
  throw new Error("S3_NAME_BUCKET environment variable is not set.");
}

async function readCsvFileFromS3(bucketName: string, key: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    S3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => reject(err));
  });
}

const getSuspects: RequestHandler = async (req, res) => {
  try {
    const { _id } = req.params;
    const o_id = new ObjectId(_id);
    const data = await getUserByFilter({ _id: o_id });
    const projects = data[0].project_id;
    const allResults: any[] = [];

    for (const proj of projects) {
      const key = proj; // The key is the file path in the bucket
      const results = await readCsvFileFromS3(bucketName, key);
      allResults.push(...results);
    }
    
    const uniqueResults = removeDuplicates(allResults);
    const singlesResults = getSingleSuspects(allResults)
    res.status(200).send({pairs: uniqueResults, singles: singlesResults});
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

function removeDuplicates(allResults: Result[]): Result[] {
  const seenPairs = new Set<string>();
  const uniqueResults: Result[] = [];

  for (const result of allResults) {
      const { "Corpus 1": corpus1, "Corpus 2": corpus2 } = result;
      const sortedPair = [corpus1, corpus2].sort().join('-');

      if (corpus1 !== corpus2 && !seenPairs.has(sortedPair)) {
          seenPairs.add(sortedPair);
          uniqueResults.push(result);
      }
  }
  uniqueResults.sort((a, b) => a.value - b.value);
  return uniqueResults;
}

type AverageResult = {
  "corpus": string,
  "averageValue": number
};

function getSingleSuspects(allResults: Result[]): AverageResult[] {
  const scoreSum: Record<string, number> = {};
  const occurrenceCount: Record<string, number> = {};

  for (const result of allResults) {
    const corpus1 = result["Corpus 1"];
    const corpus2 = result["Corpus 2"];
    const value = parseFloat(result.value.toString());

    // Update sum and count for Corpus 1
    if (!(corpus1 in scoreSum)) {
      scoreSum[corpus1] = 0;
      occurrenceCount[corpus1] = 0;
    }
    scoreSum[corpus1] += value;
    occurrenceCount[corpus1] += 1;

    // Update sum and count for Corpus 2
    if (!(corpus2 in scoreSum)) {
      scoreSum[corpus2] = 0;
      occurrenceCount[corpus2] = 0;
    }
    scoreSum[corpus2] += value;
    occurrenceCount[corpus2] += 1;
  }

  const averageScores: AverageResult[] = [];
  for (const corpus in scoreSum) {
    averageScores.push({
      corpus,
      averageValue: scoreSum[corpus] / occurrenceCount[corpus]
    });
  }

  // Sort the average scores from smallest to largest
  averageScores.sort((a, b) => a.averageValue - b.averageValue);

  return averageScores;
}
export { getSuspects };
