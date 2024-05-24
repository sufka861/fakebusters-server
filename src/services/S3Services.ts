
import { exec } from "child_process";
import AWS from "aws-sdk";
import fs from "fs";


function runPythonScript(scriptPath: string, args: string[], outputFileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `python "${scriptPath}" "${outputFileName}" ${args.join(' ')}`;
      console.log(`Executing command: ${command}`);
      const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
      exec(command, { env }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reject(error.message);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          reject(stderr);
          return;
        }
        console.log(`Stdout: ${stdout}`);
        resolve(stdout.trim());
      });
    });
  }

  function runPythonScriptPreprocessing(scriptPath: string, args: string, outputFileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `python "${scriptPath}" "${outputFileName}" ${args}`;
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

  const uploadFileToS3Direct = async (
    filePath: string,
    fileName: string,
    metadata: any
  ): Promise<void> => {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const s3 = new AWS.S3();
      const params = {
        Bucket: "testbucket-lpa",
        Key: fileName,
        Body: fileBuffer,
        ContentType: "text/csv",
        Metadata: metadata,
      };
  
      const data = await s3.putObject(params).promise();
      console.log("Object uploaded successfully:", data);
    } catch (err) {
      console.error("Error uploading object:", err);
      throw err;
    }
  };

  function removeElementFromJson(jsonObj: any, keyToRemove: string): any {
    const { [keyToRemove]: _, ...updatedJsonObj } = jsonObj;
    return updatedJsonObj;
  }
  
  export {  runPythonScript, runPythonScriptPreprocessing,uploadFileToS3Direct, removeElementFromJson };
