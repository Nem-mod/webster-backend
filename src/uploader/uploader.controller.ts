import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'uploader',
  version: '1',
})
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor(
      'file' /*, {
      storage: multerGoogleStorage.storageEngine({
        projectId: 'webster-424715',
        keyFilename: './src/uploader/webster-424715-a53e01f188b6.json',
        bucket: 'webster_images',
      }),
    }*/,
    ),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<string> {
    return await this.uploaderService.upload(file);
  }
}
