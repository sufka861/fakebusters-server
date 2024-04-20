import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { exec } from 'child_process';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import {notifyUserByEmail} from '../utils/sendEmail/sendMail'


const handlePreprocessing: RequestHandler = async (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");  // Explicit return
    }

    const tempDir = path.resolve(__dirname, '..', '..', 'src', 'python', 'data');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const { threshold, signature } = req.body;
    const metadata = { signature, threshold };
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

    const combinedFileName = originalFileNames.join('+');
    const newFileName = `${combinedFileName}_${uuid()}.csv`; 
    const scriptPath = path.join(__dirname, '..', 'python', 'Preprocessing.py');

    try {
        const output = await runPythonScript(scriptPath, filePaths, newFileName);
        const intermediateFilePath = path.join(tempDir, newFileName);

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


function runPythonScript(outputFileName: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        const baseDir = process.env.PYTHON_SCRIPT_DIR || path.join(__dirname, '..', '..', 'src', 'python');
        const scriptPath = path.join(baseDir, 'Preprocessing.py');
        const argsString = args.map(filePath => `"${filePath}"`).join(' ');
        const command = `python "${scriptPath}" "${outputFileName}" ${argsString}`;
        console.log(`Executing command: ${command}`); 

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
}


const uploadFileToS3Direct = async (filePath: string, fileName: string, metadata: any): Promise<void> => {
    try {
        const fileContent = fs.readFileSync(filePath);
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'testbucket-lpa',
            Key: fileName,
            Body: fileContent,
            Metadata: metadata
        };
        const data = await s3.putObject(params).promise();
        console.log('Object uploaded successfully:', data);
    } catch (err) {
        console.error('Error uploading object:', err);
        throw err;
    }
};
//Test for sending an email, add to the function of receiving the results after a database has been built
    const handleMail: RequestHandler = async (req, res) => {
    try{
        const user={name: "racheli", email: "dkracheli135@gmail.com"}
        notifyUserByEmail(user.name, user.email);
        res.status(200).send("yesss");
    } catch (err) {
        res.status(500).send(err);
    }
    }


export { handlePreprocessing, handleMail};