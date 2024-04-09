import { Request, RequestHandler, Response } from 'express';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

AWS.config.update({
    accessKeyId: process.env.ACCESS_AWS_S3,
    secretAccessKey: process.env.SECRET_AWS,
    region: process.env.S3_REGION
});

const s3 = new AWS.S3();

interface CsvRecord {
    'Corpus 1': string;
    'Corpus 2': string;
    value: number;
}

interface SockpuppetDetectionChartProps {
    data: {
        VeryLowLikelihood: number;
        LowLikelihood: number;
        MediumLikelihood: number;
        HighLikelihood: number;
    };
}

const calculateIdentityLikelihood = (records: CsvRecord[]): SockpuppetDetectionChartProps => {
    let likelihoodCategories = {
        VeryLowLikelihood: 0,
        LowLikelihood: 0,
        MediumLikelihood: 0,
        HighLikelihood: 0
    };

    records.forEach(record => {
        if (record.value < 0.25) {
            likelihoodCategories.HighLikelihood++;
        } else if (record.value < 0.5) {
            likelihoodCategories.MediumLikelihood++;
        } else if (record.value < 0.75) {
            likelihoodCategories.LowLikelihood++;
        } else {
            likelihoodCategories.VeryLowLikelihood++;
        }
    });

    return { data: likelihoodCategories };
};

const handleSSE: RequestHandler = (req: Request, res: Response): void => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    const fileName = req.query.fileName as string | undefined;
    if (!fileName) {
        res.write('data: {"error": "No fileName provided"}\n\n');
        res.end();
        return;
    }


    const bucketName = process.env.S3_NAME_BUCKET;
    if (!bucketName) {
        res.write('data: {"error": "Bucket name is undefined"}\n\n');
        res.end();
        return;
    }

    const checkFileExists = setInterval(() => {
        const params = { Bucket: bucketName, Key: fileName };
        s3.headObject(params, (err, metadata) => {
            if (err) {
                if (err.code === 'NotFound') {
                    res.write(`data: ${JSON.stringify({ time: new Date().toISOString(), message: 'File still processing...' })}\n\n`);
                } else {
                    clearInterval(checkFileExists);
                    res.write(`data: ${JSON.stringify({ time: new Date().toISOString(), error: 'Error accessing file: ' + err.message })}\n\n`);
                    res.end();
                }
            } else {
                clearInterval(checkFileExists);
                const csvFile = s3.getObject({ Bucket: bucketName, Key: fileName }).createReadStream();
                const records: CsvRecord[] = [];
                csvFile.pipe(csv())
                    .on('data', (data: CsvRecord) => records.push(data))
                    .on('end', () => {
                        const sockpuppetData = calculateIdentityLikelihood(records);
                        const result = JSON.stringify({
                            time: new Date().toISOString(),
                            message: 'Process completed',
                            resultsLPA: records,
                            sockpuppetData: sockpuppetData.data
                        });
                        console.log(result);
                        res.write(`data: ${result}\n\n`);
                        res.end();
                    })
                    .on('error', (error) => {
                        res.write(`data: ${JSON.stringify({ time: new Date().toISOString(), error: 'Error processing file: ' + error.message })}\n\n`);
                        res.end();
                    });
            }
        });
    }, 10000); // Check every 10 seconds

    req.on("close", () => {
        clearInterval(checkFileExists);
        res.end();
    });
};

export default handleSSE;
