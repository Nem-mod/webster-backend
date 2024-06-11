import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './schemas/image.schema';
import { FullImageDto } from './dto/full-image.dto';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import { UnsplashImageDto } from './dto/unsplash-image.dto';

@Injectable()
export class UploaderService {
  private unsplash;

  private storage: Storage;
  private bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {
    const unsplashAccessKey = this.configService.get<string>(
      'api.unsplash.access',
    );

    this.storage = new Storage({
      projectId: configService.get('api.gcs.project-id'),
      keyFilename: configService.get('api.gcs.key-file-path'),
    });
    this.bucketName = configService.get('api.gcs.bucket-name');
    this.unsplash = createApi({
      accessKey: unsplashAccessKey,
      fetch: nodeFetch as unknown as typeof fetch,
    });
  }

  async uploadImage(
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

  async updateTime(imageId: string, userId: string): Promise<void> {
    await this.imageModel.findByIdAndUpdate(
      { _id: imageId, user: userId },
      { updatedAt: new Date() },
    );
  }

  async getImagesByUser(userId: string): Promise<FullImageDto[]> {
    return this.imageModel.find(
      { user: userId },
      {},
      { sort: { updatedAt: -1 } },
    );
  }

  async getImagesFromUnsplash(search: string): Promise<UnsplashImageDto[]> {
    try {
      const response = await this.unsplash.search.getPhotos({
        query: search,
        page: 1,
        perPage: 20,
      });

      return response.response.results.map((image): UnsplashImageDto => {
        return {
          _id: image.id,
          url: image.urls.regular,
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
