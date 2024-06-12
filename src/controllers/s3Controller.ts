import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { RequestHandler } from "express";
import { notifyUserByEmail } from "../utils/sendEmail/sendMail";
import { getProfileByFilter, createProfile } from "../repositories/profile.repository";
import { get_user } from "./twitterController";
import { createResult } from "../repositories/lpa.repository";
import { v4 as uuid } from "uuid";
import {  runPythonScript, runPythonScriptPreprocessing,uploadFileToS3Direct, removeElementFromJson } from "../services/S3Services"



const handleNewProject: RequestHandler = async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const tempDir = path.resolve(process.cwd(), "src", "python", "data");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    const { filePaths, combinedFileName } = await processFiles(req, tempDir);
    const vocabularyPath = path.resolve(process.cwd(), 'src', 'python', 'data', 'vocabularyDefault.txt');
    const data = fs.readFileSync(vocabularyPath, 'utf8');
    const vocabularyData = data.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(word => ({ name: word }));

    const pythonScript = path.resolve(process.cwd(), 'src', 'python', "UplodeCSV.py");
    const combinedFilePath = path.join(tempDir, combinedFileName);

    const pythonResult = await runPythonScript(pythonScript, filePaths, combinedFilePath);
    const postsDistribution = JSON.parse(pythonResult);

    for (const filePath of filePaths) {
      try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}.`);
      }
    }

    return res.json({ filePaths, combinedFileName, postsDistribution, vocabularyData });
  } catch (error) {
    console.error("Error in handleNewProject:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const handlePreprocessing: RequestHandler = async (req: Request, res: Response) => {
  const params = req.body;
  const metadata = { signature: String(params.signature) };

  if (!params.rowDataFileName) {
    console.error("rowDataFileName is missing");
    return res.status(400).send("rowDataFileName is required");
  }

  const scriptPath = path.resolve(process.cwd(), 'src', 'python', 'Preprocessing.py');
  const filePaths = path.resolve(process.cwd(), 'src', 'python', 'data', params.rowDataFileName);
  const newFileName = `freq_${params.rowDataFileName}`;
  const outputFilePath = path.resolve(process.cwd(), 'src', 'python', 'data', newFileName);

  // Save the vocabulary JSON content to a file
  const uniqueFileName = `vocabulary_${Date.now()}.json`;
  const vocabularyFilePath = path.resolve(process.cwd(), 'src', 'python', 'data', uniqueFileName);

  try {
    fs.writeFileSync(vocabularyFilePath, JSON.stringify(params.vocabulary));

    const pythonParams = [
      filePaths,
      outputFilePath,
      params.account_threshold,
      params.wordThreshold,
      params.isDroppingLinks,
      params.isDroppingPunctuation,
      params.showTblholdSettings,
      vocabularyFilePath,
    ];

    console.log(pythonParams)
    console.log("Start running python script");

    const output = await runPythonScriptPreprocessing(scriptPath, pythonParams);
    console.log("End running python script");
    fs.unlinkSync(vocabularyFilePath);

    // Remove debug information if present
    const jsonStartIndex = output.indexOf('{');
    const output_JSON = JSON.parse(output.substring(jsonStartIndex));
    const users = output_JSON.author_username;

    for (const user_name of users) {
      console.log("user name= " + user_name);
      const filter_in_db = { "data.username": user_name };
      const filter_error = { "errors.value": user_name };
      const user_from_db = await getProfileByFilter(filter_in_db) || await getProfileByFilter(filter_error);

      if (!user_from_db) {
        const user_from_twitter = await get_user(user_name);
        await createProfile(user_from_twitter);
      } else {
        console.log(`user ${user_name} already exists`);
      }
    }

    await uploadFileToS3Direct(outputFilePath, newFileName, metadata);

    const keyToRemove = "author_username";
    const updatedJsonObj = removeElementFromJson(output_JSON, keyToRemove);
    updatedJsonObj.file_id = newFileName;
    await createResult(updatedJsonObj);

    res.setHeader("Content-Type", "application/json");
    return res.send(output);
  } catch (err) {
    console.error("Error processing files:", err);

    // Ensure the vocabulary file is deleted even if an error occurs
    if (fs.existsSync(vocabularyFilePath)) {
      fs.unlinkSync(vocabularyFilePath);
    }

    return res.status(500).send("Error processing the files");
  }
};


async function processFiles(req: Request, tempDir: string): Promise<{ filePaths: string[], combinedFileName: string }> {
  const filesData = req.files as Express.Multer.File[];
  const filePaths: string[] = [];
  const originalFileNames: string[] = [];

  for (const file of filesData) {
    if (file.mimetype !== "text/csv") {
      throw new Error("All files must be CSVs.");
    }

    const originalFileNameWithoutExtension = path.parse(file.originalname).name;
    originalFileNames.push(originalFileNameWithoutExtension);

    const requestId = uuid();
    const fileName = `${requestId}-${originalFileNameWithoutExtension}.csv`;
    const filePath = path.join(tempDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    filePaths.push(filePath);
  }

  const combinedFileName = `${originalFileNames.join("+")}_${uuid()}.csv`;

  return { filePaths, combinedFileName };
}

const handleMail: RequestHandler = async (req, res) => {
  try {
    const user = { name: "racheli", email: "dkracheli135@gmail.com" };
    notifyUserByEmail(user.name, user.email);
    res.status(200).send("yesss");
  } catch (err) {
    res.status(500).send(err);
  }
};

export {  handleNewProject, handleMail, handlePreprocessing };
