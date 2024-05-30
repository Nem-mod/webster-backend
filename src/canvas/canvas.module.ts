import { Module } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CanvasController } from './canvas.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Canvas, CanvasSchema } from './schemas/canvas.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
  ],
  providers: [CanvasService],
  controllers: [CanvasController],
})
export class CanvasModule {}
