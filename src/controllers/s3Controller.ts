// s3Controller.ts
import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import axios from "axios";

import { exec } from "child_process";
import { writeFile } from "fs/promises";
import fs from 'fs';
import path from 'path';


const uploadFileToS3: RequestHandler = async (req, res): Promise<void> => {
  if (!process.env.S3_POSTS_BUCKET_URL) {
    res.status(500).send("S3 bucket URL is not configured.");
    return;
  }
  if (!req.file || !req.file.buffer) {
    res.status(400).send("No file uploaded.");
    return;
  }
  if (req.file.mimetype !== "text/csv") {
    res.status(400).send("File must be a CSV.");
    return;
  }
  const requestId: string = uuid();
  try {
    // TODO: Add request ID to the S3 object metadata
    const URL: string = `${process.env.S3_POSTS_BUCKET_URL}${requestId}.csv`;
    await axios.put(URL, req.file.buffer, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
    res
      .status(200)
      .json({
        message: "File uploaded successfully to S3.",
        requestId: requestId,
      });
  } catch (error) {
    res.status(500).send("Failed to upload file to S3.");
  }
};


const handlePreprocessing: RequestHandler = async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded.");
    res.status(400).send("No file uploaded.");
    return;
  }
  const tempDir = path.join('C:', 'temp');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const fileName = req.file.originalname.replace(/\.csv$/, '')
  const filePath = path.join(tempDir, req.file.originalname);
  await writeFile(filePath, req.file.buffer);

  const scriptPath = 'src/python/Preprocessing.py';

  runPythonScript(scriptPath, [filePath])
    .then(async (output) => {
      console.log('Python script output:', output);
      const intermediateFilePath = `src/python/data/${fileName}_frequency.csv`;
      
      // Upload the CSV file to S3
      await uploadFileDirectlyToS3(intermediateFilePath);

      // Send the Python script's output to the client
      res.setHeader('Content-Type', 'application/json');
      res.send(output);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error processing the file.');
    });
};

function runPythonScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
    exec(`python ${scriptPath} ${args.join(' ')}`, { env }, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

const uploadFileDirectlyToS3 = async (filePath: string): Promise<void> => {

  if (!process.env.S3_POSTS_BUCKET_URL || !fs.existsSync(filePath)) {
    console.error("S3 bucket URL is not configured or file does not exist.");
    return;
  }

  const requestId: string = uuid();
  // const fileContent = fs.readFileSync(filePath);
  // const URL: string = `${process.env.S3_POSTS_BUCKET_URL}${requestId}.csv`;

  try {
    // await axios.put(URL, fileContent, {
    //   headers: {
    //     "Content-Type": "text/csv",
    //   },
    // });
    console.log("File uploaded successfully to S3, requestId:", requestId);
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
  }
};


export { uploadFileToS3,handlePreprocessing };
