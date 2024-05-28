import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploaderService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: configService.get('api.gcs.project-id'),
      keyFilename: configService.get('api.gcs.key-file-path'),
    });
    this.bucketName = configService.get('api.gcs.bucket-name');
  }

  async upload(file: Express.Multer.File): Promise<string> {
    // TODO: Refactor this shit
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(uuid() + '.' + file.originalname);

    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve(
          `https://storage.googleapis.com/${this.bucketName}/${blob.name}`,
        );
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.end(file.buffer);
    });
  }
}
