import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Canvas } from './schemas/canvas.schema';
import { Model } from 'mongoose';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { FullCanvasDto } from './dto/full-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name) private readonly canvasModel: Model<Canvas>,
  ) {}

  async create(
    canvas: CreateCanvasDto,
    userId: string,
  ): Promise<FullCanvasDto> {
    const newCanvas: Canvas = new this.canvasModel({ ...canvas, user: userId });

    await newCanvas.save();

    return newCanvas.toObject();
  }

  async findById(id: string): Promise<FullCanvasDto> {
    const canvas: Canvas = await this.canvasModel.findById(id);

    if (!canvas) throw new NotFoundException('Canvas not found');

    return canvas.toObject();
  }

  async findAllByUser(userId: string): Promise<FullCanvasDto[]> {
    return this.canvasModel.find({ user: userId });
  }

  async isCanvasOwner(canvasId: string, userId: string): Promise<boolean> {
    const canvas: FullCanvasDto = await this.findById(canvasId);

    if (canvas.user?.toString() !== userId.toString())
      throw new ForbiddenException('You are not a canvas owner');

    return true;
  }

  async update(
    canvasId: string,
    canvas: UpdateCanvasDto,
  ): Promise<FullCanvasDto> {
    const updatedCanvas: Canvas = await this.canvasModel.findByIdAndUpdate(
      canvasId,
      canvas,
      { new: true },
    );

    return updatedCanvas.toObject();
  }

  async delete(canvasId: string): Promise<void> {
    await this.canvasModel.findByIdAndDelete(canvasId);
  }
}
