import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { getUsersFromFile } from '../mockData/editUser';

const uploadFileToS3: RequestHandler = async (req, res) => {
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

    const requestId = uuid();
    const URL = `${process.env.S3_POSTS_BUCKET_URL}${requestId}.csv`;

    try {
        await axios.put(URL, req.file.buffer, {
            headers: { "Content-Type": "text/csv" },
        });
        res.status(200).json({ message: "File uploaded successfully to S3.", requestId });
    } catch (error) {
        res.status(500).send("Failed to upload file to S3.");
    }
};

const handlePreprocessing: RequestHandler = async (req, res) => {
  if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
  }

  if (req.file.mimetype !== "text/csv") {
      res.status(400).send("File must be a CSV.");
      return;
  }

  const tempDir = "src/python/data";
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileName = req.file.originalname.replace(/\.csv$/, '');
  const filePath = path.join(tempDir, req.file.originalname);
  await writeFile(filePath, req.file.buffer);

  const scriptPath = 'src/python/Preprocessing.py';

  try {
      const output = await runPythonScript(scriptPath, [filePath]);
      const intermediateFilePath = `src/python/data/${fileName}_frequency.csv`;

      await uploadFileDirectlyToS3(intermediateFilePath);
      res.setHeader('Content-Type', 'application/json');
      res.send(output);
  } catch (err) {
      res.status(500).send('Error processing the file.');
  }
};


function runPythonScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
      const command = `python ${scriptPath} ${args.join(' ')}`;
      const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };

      exec(command, { env }, (error, stdout, stderr) => {
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

const handleReadResult: RequestHandler = async (req, res) => {
    const userID = parseInt(req.params.id, 10);
    const userResult = await getUsersFromFile(userID);

    if (!userResult) {
        res.status(404).send('User not found');
        return;
    }
    res.json(userResult);
};

export { uploadFileToS3, handlePreprocessing, handleReadResult };
