import { Body, Controller, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { plainToInstance } from 'class-transformer';
import { FullCanvasDto } from './dto/full-canvas.dto';
import { AccessAuthGuard } from '../auth/guards/access-auth.guard';

@Controller({
  path: 'canvas',
  version: '1',
})
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @UseGuards(AccessAuthGuard)
  @Post()
  @SetMetadata('class_serializer:options', { strategy: 'exposeAll' })
  async create(@Body() canvas: CreateCanvasDto): Promise<FullCanvasDto> {
    const newCanvas: FullCanvasDto = await this.canvasService.create(canvas);

    return plainToInstance(FullCanvasDto, newCanvas);
  }
}
