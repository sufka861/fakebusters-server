import { RequestHandler } from "express";
import { getUserByFilter } from "../repositories/users.repository";
import { ObjectId } from "mongodb";
import AWS from "aws-sdk";
import csv from 'csv-parser';

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
        console.log(results);
        resolve(results);
      })
      .on('error', (err) => reject(err));
  });
}

const getSuspectsByUser: RequestHandler = async (req, res) => {
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
    allResults.sort((a, b) => b.value - a.value);
    res.status(200).send(allResults);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

export { getSuspectsByUser };











  //const s3 = new AWS.S3();
  
//   const getResultFromBucket: any = async (filename: string) => {
//     try {
//       /*get request to aws with S3_RESULTS_BUCKET_URL/filename  then return the csv filw*/
//       const url = S3_RESULTS_BUCKET_URL+filename
//       const response = await axios.get(url); 
//       return response;
//     } catch (err: any) {
//       return err;
//     }
//   };