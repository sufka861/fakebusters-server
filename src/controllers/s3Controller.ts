import fs from 'fs';
import path from 'path';
import { RequestHandler } from 'express';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

          
const handlePreprocessing: RequestHandler = async (req, res) => {
    console.log("handlePreprocessing")
    if (!req.files || req.files.length === 0) {
        res.status(400).send("No files uploaded.");
        return;
    }

    const tempDir = "src/python/data";
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const { threshold, signature } = req.body;
    const metadata = {
        'signature': signature,
        'threshold': threshold
      };
    const filesData = req.files as Express.Multer.File[];
    const filePaths = [];
    const originalFileNames = [];
    for (const file of filesData) {
        if (file.mimetype !== "text/csv") {
            res.status(400).send("All files must be CSVs.");
            return;
        }

        const originalFileNameWithoutExtension = path.parse(file.originalname).name;
        originalFileNames.push(originalFileNameWithoutExtension);
        
        const requestId = uuid();
        const fileName = `${requestId}-${originalFileNameWithoutExtension}.csv`;
        const filePath = path.join(tempDir, fileName);
        await writeFile(filePath, file.buffer);
        filePaths.push(filePath);
    }

    const combinedFileName = originalFileNames.join('+');
    const newFileName = `${combinedFileName}_${uuid()}.csv`; 
    const scriptPath = 'src/python/Preprocessing.py';

    try {
        const output = await runPythonScript(scriptPath, filePaths, newFileName);
        const intermediateFilePath = path.join(tempDir, newFileName);
        console.log(intermediateFilePath);
        await uploadFileToS3Direct(intermediateFilePath, newFileName, metadata );
        filePaths.forEach(file => fs.unlinkSync(file));  

        res.setHeader('Content-Type', 'application/json');
        res.send(output);
    } catch (err) {
        filePaths.forEach(file => fs.unlinkSync(file));
        res.status(500).send('Error processing the files.');
    }
};


function runPythonScript(scriptPath: string, args: string[], outputFileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
      const command = `python ${scriptPath} ${outputFileName} ${args.join(' ')}`;
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


const uploadFileToS3Direct = async (filePath: string, fileName: string, metadata: any): Promise<void> => {
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist.");
      return;
    }
    const s3 = new AWS.S3();

      const tempDir = "src/python/data";
      if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
      }
  
      const fileContent = fs.readFileSync(filePath);
      const params = {
        Bucket: 'testbucket-lpa',
        Key: fileName,
        Body: fileContent,
        Metadata: metadata
      };
      s3.putObject(params, (err, data) => {
        if (err) {
            console.error('Error uploading object:', err);
        } else {
            console.log('Object uploaded successfully:', data);
        }
    });
    }

export { handlePreprocessing };