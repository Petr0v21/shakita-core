import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  accessKeyId = process.env.LOCAL_AWS_ACCESS_KEY ?? 'AKIAYPZDUIXZT36GKTWT';
  secretAccessKey =
    process.env.LOCAL_AWS_SECRET_KEY ??
    '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';
  region = process.env.AWS_BUCKET_REGION ?? 'eu-central-1';
  bucketName = process.env.AWS_BUCKET_NAME ?? 'shakita-hookah';
  constructor() {
    this.s3 = new S3({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, user_id?: string) {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: user_id.toString() + uuidv4() + '_' + file.originalname,
      ContentType: file.mimetype,
      Body: file.buffer,
    };

    return await this.s3.upload(uploadParams).promise();
  }
  //TODO Access Denied
  async deleteFile(fileName: string) {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };
    return await this.s3.deleteObject(deleteParams).promise();
  }
  // Implement other file operations as per your requirements
}
