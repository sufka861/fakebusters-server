// s3Controller.ts
import { RequestHandler } from "express";
import axios from "axios";
import { v4 as uuid } from "uuid";

const uploadFileToS3: RequestHandler = async (req, res): Promise<void> => {
  if (!process.env.S3_POSTS_BUCKET_URL) {
    res.status(500).send("S3 bucket URL is not configured.");
    return;
  }
  if (!req.file || !req.file.buffer) {
    res.status(400).send("No file uploaded.");
    return;
  }
  if (req.file.mimetype !== "text/csv") {
    res.status(400).send("File must be a CSV.");
    return;
  }
  const requestId: string = uuid();
  try {
    // TODO: Add request ID to the S3 object metadata
    const URL: string = `${process.env.S3_POSTS_BUCKET_URL}${requestId}.csv`;
    await axios.put(URL, req.file.buffer, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
    res
      .status(200)
      .json({
        message: "File uploaded successfully to S3.",
        requestId: requestId,
      });
  } catch (error) {
    res.status(500).send("Failed to upload file to S3.");
  }
};

export { uploadFileToS3 };
