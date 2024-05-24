import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { RequestHandler } from "express";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";
// import AWS from "aws-sdk";
import { notifyUserByEmail } from "../utils/sendEmail/sendMail";

// import { getProfileByFilter, createProfile } from "../dal/profileModel";
// import { get_user } from "./twitterController";
// import { createResult } from "../dal/lpaModel";

// Helper to get the correct Python script path
// function getPythonScriptPath() {
//   const basePath = path.join(process.cwd(), 'src', 'python');
//   return path.join(basePath, 'Preprocessing.py');
// }

const handleNewProject: RequestHandler = async (req: Request, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  console.log("handleNewProject")
  const tempDir = path.resolve(process.cwd(), "src", "python", "data");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  // const metadata = req.body.signature;

  try {
    const { filePaths, combinedFileName } = await processFiles(req, tempDir);
    console.log(filePaths)

    // Call the Python script to combine the files
    const pythonScript = path.resolve(process.cwd(),'src','python', "UplodeCSV.py");
    console.log(pythonScript)
    const combinedFilePath = path.join(tempDir, combinedFileName);

    await runPythonScript(pythonScript, filePaths, combinedFilePath);
    console.log(filePaths, combinedFileName )

    for (const filePath of filePaths) {
      try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}.`);
      }
    }

    return res.json({ filePaths, combinedFileName });
  } catch (error) {
    return res.status(500);
  }
}


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

const handleMail: RequestHandler = async (req, res) => {
  try {
    const user = { name: "racheli", email: "dkracheli135@gmail.com" };
    notifyUserByEmail(user.name, user.email);
    res.status(200).send("yesss");
  } catch (err) {
    res.status(500).send(err);
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


export {  handleNewProject, handleMail };
