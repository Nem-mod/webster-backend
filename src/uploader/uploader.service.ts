import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './schemas/image.schema';
import { FullImageDto } from './dto/full-image.dto';

@Injectable()
export class UploaderService {
  private storage: Storage;
  private bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {
    this.storage = new Storage({
      projectId: configService.get('api.gcs.project-id'),
      keyFilename: configService.get('api.gcs.key-file-path'),
    });
    this.bucketName = configService.get('api.gcs.bucket-name');
  }

  async upload(
    file: Express.Multer.File,
    userId: string,
  ): Promise<FullImageDto> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(uuid() + '.' + file.originalname);

    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      stream.on('finish', async () => {
        const url = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
        const image: Image = new this.imageModel({
          url,
          saved: true,
          user: userId,
        });

        await image.save();

        resolve(image.toObject());
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.end(file.buffer);
    });
  }

  async uploadUrl(urlDto: CreateUrlDto, userId: string): Promise<FullImageDto> {
    const image: Image = new this.imageModel({
      ...urlDto,
      saved: false,
      user: userId,
    });

    await image.save();

    return image.toObject();
  }
}
