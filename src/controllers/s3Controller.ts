import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { RequestHandler } from "express";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import { notifyUserByEmail } from "../utils/sendEmail/sendMail";
import { getProfileByUsername, createProfile } from "../dal/profileModel";
import { createResult } from "../dal/lpaModel";
import { get_user } from "./twitterController";

// Helper to get the correct Python script path
function getPythonScriptPath() {
  const basePath = path.join(process.cwd(), 'src', 'python');
  return path.join(basePath, 'Preprocessing.py');
}

const handlePreprocessing: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const tempDir = path.resolve(process.cwd(), "src", "python", "data");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const { signature } = req.body;
  const metadata = { signature };

  const filesData = req.files as Express.Multer.File[];
  const filePaths: string[] = [];
  const originalFileNames: string[] = [];

  for (const file of filesData) {
    if (file.mimetype !== "text/csv") {
      return res.status(400).send("All files must be CSVs.");
    }

    const originalFileNameWithoutExtension = path.parse(file.originalname).name;
    originalFileNames.push(originalFileNameWithoutExtension);

    const requestId = uuid();
    const fileName = `${requestId}-${originalFileNameWithoutExtension}.csv`;
    const filePath = path.join(tempDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    filePaths.push(filePath);
  }

  const combinedFileName = originalFileNames.join("+");
  const newFileName = `${combinedFileName}_${uuid()}.csv`;
  const scriptPath = getPythonScriptPath(); // Use the getPythonScriptPath function here

  try {
    const output = await runPythonScript(scriptPath, filePaths, newFileName); // Pass the script path as the first argument
    const output_JSON = JSON.parse(output);
    const users = output_JSON.author_username;

    for (const user_name of users) {
      const user_from_db = await getProfileByUsername(user_name);
      if (user_from_db == null) {
        const user_from_twitter = await get_user(user_name);
        await createProfile(user_from_twitter);
      } else {
        console.log(`User ${user_from_db} already exists`);
      }
    }

    const intermediateFilePath = path.join(tempDir, newFileName);

    await uploadFileToS3Direct(intermediateFilePath, newFileName, metadata);
    filePaths.forEach((file) => fs.unlinkSync(file));
    await createResult(output_JSON);
    res.setHeader("Content-Type", "application/json");
    return res.send(output);
  } catch (err) {
    console.error("Error processing files:", err);
    filePaths.forEach((file) => fs.unlinkSync(file));
    return res.status(500).send("Error processing the files");
  }
};

function runPythonScript(scriptPath: string, args: string[], outputFileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `python "${scriptPath}" "${outputFileName}" ${args.join(' ')}`;
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

const handleMail: RequestHandler = async (req, res) => {
  try {
    const user = { name: "racheli", email: "dkracheli135@gmail.com" };
    notifyUserByEmail(user.name, user.email);
    res.status(200).send("yesss");
  } catch (err) {
    res.status(500).send(err);
  }
};

export { handlePreprocessing, handleMail };
