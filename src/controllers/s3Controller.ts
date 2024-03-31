// s3Controller.ts
import { RequestHandler } from 'express';
import axios from 'axios';


const uploadFileToS3: RequestHandler = async (req, res): Promise<void> => {
    if (!process.env.S3_POSTS_BUCKET_URL) {
        res.status(500).send('S3 bucket URL is not configured.');
        return;
    }

    try {
        const response = await axios.put(process.env.S3_POSTS_BUCKET_URL, req.rawBody, {
            headers: {
                'Content-Type': 'text/csv',
            },
            responseType: 'json',
        });

        res.status(200).json({
            message: 'File uploaded successfully',
            data: response.data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to upload file to S3.');
    }
};

export { uploadFileToS3 }
