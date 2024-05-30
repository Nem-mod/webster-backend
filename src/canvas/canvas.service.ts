import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Canvas } from './schemas/canvas.schema';
import { Model } from 'mongoose';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { FullCanvasDto } from './dto/full-canvas.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name) private readonly canvasModel: Model<Canvas>,
  ) {}

  async create(canvas: CreateCanvasDto): Promise<FullCanvasDto> {
    const newCanvas = new this.canvasModel(canvas);

    await newCanvas.save();

    return newCanvas.toObject();
  }
}
