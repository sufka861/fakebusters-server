import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { RequestHandler } from "express";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import { notifyUserByEmail } from "../utils/sendEmail/sendMail";
import { getProfileByFilter, createProfile } from "../dal/profileModel";
import { get_user } from "./twitterController";
import { createResult } from "../dal/lpaModel";

// Helper to get the correct Python script path
function getPythonScriptPath() {
  const basePath = path.join(process.cwd(), "src", "python");
  console.log(basePath);
  return path.join(basePath, "Preprocessing.py");
}

const handlePreprocessing: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log("inside handlePreprocessing");
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const tempDir = path.resolve(process.cwd(), "src", "python", "data");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filesData = req.files as Express.Multer.File[];
  const filePaths: string[] = [];
  const originalFileNames: string[] = [];
  
  const requestId = uuid();
  for (const file of filesData) {
    if (file.mimetype !== "text/csv") {
      return res.status(400).send("All files must be CSVs.");
    }
    
    const originalFileNameWithoutExtension = path.parse(file.originalname).name;
    originalFileNames.push(originalFileNameWithoutExtension);
    
    const fileName = `${requestId}-${originalFileNameWithoutExtension}.csv`;
    const filePath = path.join(tempDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    filePaths.push(filePath);
  }

  const { signature } = req.body;
  const metadata = { signature };
  
  const combinedFileName = originalFileNames.join("+");
  const newFileName = `${combinedFileName}_${uuid()}.csv`;
  try {
    const output = await runPythonScript(filePaths, newFileName);
    const output_JSON = JSON.parse(output);
    const users = output_JSON.author_username;
    console.log(users.length()) 
    for (const user_name of users) {
      const filter_in_db = {"data.username": user_name}
      const user_from_db = await getProfileByFilter(filter_in_db);
      if (user_from_db == null) {
        // Call x API to get this user and save it in db
        const filter_error = {"errors.value": user_name}
        const user_from_db = await getProfileByFilter(filter_error);
        if (user_from_db == null) {      
          const user_from_twitter = await get_user(user_name);
        createProfile(user_from_twitter);
        } 
      } else {
        console.log(`user ${user_name} already exists`);
      }
    }

    const intermediateFilePath = path.join(tempDir, newFileName);

    await uploadFileToS3Direct(intermediateFilePath, newFileName, metadata);
    filePaths.forEach((file) => fs.unlinkSync(file));
    /* insert categories of file to db */ 
    const keyToRemove = "author_username";
    const updatedJsonObj = removeElementFromJson(output_JSON, keyToRemove);
    updatedJsonObj.file_id = newFileName;
    console.log(updatedJsonObj)
    createResult(updatedJsonObj);
    res.setHeader("Content-Type", "application/json");
    return res.send(output);
  } catch (err) {
    console.error("Error processing files:", err);
    filePaths.forEach((file) => fs.unlinkSync(file));
    return res.status(500).send("Error processing the files");
  }
};

const runPythonScript = (
  args: string[],
  outputFileName: string
): Promise<string> => {
  const scriptPath = getPythonScriptPath(); 
  const pythonExecutable = path.join(process.cwd(), "myenv", "bin", "python"); 
  const argsString = args.map((filePath) => `"${filePath}"`).join(" ");
  const command = `${pythonExecutable} "${scriptPath}" "${outputFileName}" ${argsString}`;
  console.log(`Executing command: ${command}`); // This logs the exact command

  return new Promise((resolve, reject) => {
    exec(
      command,
      { env: { ...process.env, PYTHONIOENCODING: "utf-8" } },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);
          reject(error.message);
          return;
        }
        if (stderr && !stderr.toLowerCase().includes("downloading")) {
          console.error("Script error:", stderr);
          reject(stderr);
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
};

const uploadFileToS3Direct = async (
  filePath: string,
  fileName: string,
  metadata: any
): Promise<void> => {
  console.log("Uploading file to S3:", filePath, fileName);
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

    // Upload the file to S3
    const data = await s3.putObject(params).promise();

    console.log("Object uploaded successfully:", data);
  } catch (err) {
    console.error("Error uploading object:", err);
    throw err;
  }
};
//Test for sending an email, add to the function of receiving the results after a database has been built
const handleMail: RequestHandler = async (req, res) => {
  try {
    const user = { name: "racheli", email: "dkracheli135@gmail.com" };
    notifyUserByEmail(user.name, user.email);
    res.status(200).send("yesss");
  } catch (err) {
    res.status(500).send(err);
  }
};

function removeElementFromJson(jsonObj: any, keyToRemove: string): any {
  const { [keyToRemove]: _, ...updatedJsonObj } = jsonObj;
  return updatedJsonObj;
}


export { handlePreprocessing, handleMail };
createResult