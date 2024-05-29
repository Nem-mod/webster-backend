import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUrlDto } from './dto/create-url.dto';
import { FullImageDto } from './dto/full-image.dto';
import { plainToInstance } from 'class-transformer';
import { ReqUser } from '../auth/decorators/user.decorator';
import { FullUserDto } from '../user/dto/full-user.dto';
import { OptionalRefreshJwtAuthGuard } from '../auth/guards/refresh-auth.guard.optional';
import { AccessAuthGuard } from '../auth/guards/access-auth.guard';

@Controller({
  path: 'uploader',
  version: '1',
})
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @UseGuards(OptionalRefreshJwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @ReqUser() user: FullUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
          }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FullImageDto> {
    const image: FullImageDto = await this.uploaderService.uploadImage(
      file,
      user?._id,
    );

    return plainToInstance(FullImageDto, image);
  }

  @UseGuards(OptionalRefreshJwtAuthGuard)
  @Post('url')
  async uploadUrl(
    @ReqUser() user: FullUserDto,
    @Body() urlDto: CreateUrlDto,
  ): Promise<FullImageDto> {
    const image: FullImageDto = await this.uploaderService.uploadUrl(
      urlDto,
      user?._id,
    );

    return plainToInstance(FullImageDto, image);
  }

  // TODO: In case of canvas sharing for changing: create a list of
  //  users that have copy of this image and their updateAt timestamps
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('url/:id')
  async updateTime(
    @ReqUser() user: FullUserDto,
    @Param('id') imageId: string,
  ): Promise<void> {
    await this.uploaderService.updateTime(imageId, user._id);
  }

  @UseGuards(AccessAuthGuard)
  @Get('url')
  async getAllUserImages(
    @ReqUser() user: FullUserDto, // TODO: Maybe add sort parameters + pagination
  ): Promise<FullImageDto[]> {
    const images: FullImageDto[] = await this.uploaderService.getImagesByUser(
      user._id,
    );

    return plainToInstance(FullImageDto, images);
  }
}
