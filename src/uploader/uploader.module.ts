import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';

@Module({
  imports: [],
  providers: [UploaderService],
  controllers: [UploaderController],
})
export class UploaderModule {}
