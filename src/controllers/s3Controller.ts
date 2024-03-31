// s3Controller.ts
import { RequestHandler } from 'express';
import axios from 'axios';


const uploadFileToS3: RequestHandler = async (req, res): Promise<void> => {
    if (!process.env.S3_POSTS_BUCKET_URL) {
        res.status(500).send('S3 bucket URL is not configured.');
        return;
    }

    if (!req.file || !req.file.buffer) {
        res.status(400).send('No file uploaded.');
        return;
    }

    try {
        await axios.put(process.env.S3_POSTS_BUCKET_URL, req.file.buffer, {
            headers: {
                'Content-Type': 'text/csv',
            },
        });
        res.status(200).json({ message: 'File uploaded successfully to S3.' });
    } catch (error) {
        // console.error('Error uploading to S3:', error.message);
        res.status(500).send('Failed to upload file to S3.');
    }
};

export { uploadFileToS3 }
