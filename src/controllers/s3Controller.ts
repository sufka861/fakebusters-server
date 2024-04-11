import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

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

    const requestId = uuid();
    const originalFileNameWithoutExtension = path.parse(req.file.originalname).name;
    
    const fileName = `${requestId}-${originalFileNameWithoutExtension}`;
    const filePath = path.join(tempDir, `${fileName}.csv`);
    await writeFile(filePath, req.file.buffer);

    const scriptPath = 'src/python/Preprocessing.py';

    try {
        const output = await runPythonScript(scriptPath, [filePath]);
        const newFileName = `${fileName}_frequency.csv`;
        const intermediateFilePath = path.join(tempDir, newFileName);
        console.log(intermediateFilePath)
        await uploadFileDirectlyToS3(intermediateFilePath, newFileName);
        fs.unlinkSync(filePath);

        res.setHeader('Content-Type', 'application/json');
        res.send(output);
    } catch (err) {
        fs.unlinkSync(filePath);
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


const uploadFileDirectlyToS3 = async (filePath: string, fileName: string): Promise<void> => {
  if (!process.env.S3_POSTS_BUCKET_URL || !fs.existsSync(filePath)) {
    console.error("S3 bucket URL is not configured or file does not exist.");
    return;
  }

  const fileContent = fs.readFileSync(filePath);
  const URL: string = `${process.env.S3_POSTS_BUCKET_URL}${fileName}`;

  try {
    await axios.put(URL, fileContent, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
    console.log( `File uploaded ${fileName}successfully to S3, requestId:`, fileName);
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
  }
};

export { uploadFileToS3, handlePreprocessing };
