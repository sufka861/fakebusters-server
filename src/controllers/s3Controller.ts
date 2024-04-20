import fs from 'fs';
import path from 'path';
import { Request, Response, RequestHandler } from 'express';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import os from 'os'; // Corrected import
import { notifyUserByEmail } from '../utils/sendEmail/sendMail';

const dataDirectory = getDataPath(); // Call once and use throughout

function getPythonScriptPath() {
    if (os.platform() === 'win32') {
        return path.join(__dirname, '..', 'python', 'Preprocessing.py');
    } else {
        return path.join('/opt', 'render', 'project', 'src', 'python', 'Preprocessing.py');
    }
}

function getDataPath() {
    const baseDir = os.platform() === 'win32' ? path.resolve(__dirname, '..', '..', 'src', 'python', 'data') :
        path.join('/opt', 'render', 'project', 'src', 'python', 'data');
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    return baseDir;
}

const handlePreprocessing: RequestHandler = async (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
    }

    const tempDir = path.resolve(__dirname, '..', '..', 'src', 'python', 'data');
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
        const filePath = path.join(dataDirectory, fileName);
        await fs.promises.writeFile(filePath, file.buffer);
        filePaths.push(filePath);
    }

    const combinedFileName = originalFileNames.join('+');
    const newFileName = `${combinedFileName}_${uuid()}.csv`; 

    try {
        const output = await runPythonScript(filePaths, newFileName);
        const intermediateFilePath = path.join(dataDirectory, newFileName);

        await uploadFileToS3Direct(intermediateFilePath, newFileName, metadata);
        filePaths.forEach(file => fs.unlinkSync(file));

        res.setHeader('Content-Type', 'application/json');
        return res.send(output);
    } catch (err) {
        console.error('Error processing files:', err);
        filePaths.forEach(file => fs.unlinkSync(file));
        return res.status(500).send('Error processing the files');
    }
};

const runPythonScript = (args: string[], outputFileName: string): Promise<string> => {
    const scriptPath = getPythonScriptPath();
    const argsString = args.map(filePath => `"${filePath}"`).join(' ');
    const command = `python "${scriptPath}" "${outputFileName}" ${argsString}`;
    console.log(`Executing command: ${command}`);

    return new Promise((resolve, reject) => {
        exec(command, { env: { ...process.env, PYTHONIOENCODING: 'utf-8' }}, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution error:', error);
                reject(error.message);
                return;
            }
            if (stderr) {
                console.error('Script error:', stderr);
                reject(stderr);
                return;
            }
            resolve(stdout.trim());
        });
    });
};

const uploadFileToS3Direct = async (filePath: string, fileName: string, metadata: any): Promise<void> => {
    try {
 
        const fileBuffer = fs.readFileSync(filePath);
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'testbucket-lpa',
            Key: fileName,
            Body: fileBuffer,
            ContentType: 'text/csv', 
            Metadata: metadata
        };

        // Upload the file to S3
        const data = await s3.putObject(params).promise();

        console.log('Object uploaded successfully:', data);
    } catch (err) {
        console.error('Error uploading object:', err);
        throw err;
    }
};

const handleMail: RequestHandler = async (req, res) => {
    try {
        const user = { name: "Racheli", email: "dkracheli135@gmail.com" };
        notifyUserByEmail(user.name, user.email);
        res.status(200).send("Yes");
    } catch (err) {
        res.status(500).send(err);
    }
};

export { handlePreprocessing, handleMail };
