import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { plainToInstance } from 'class-transformer';
import { FullCanvasDto } from './dto/full-canvas.dto';
import { AccessAuthGuard } from '../auth/guards/access-auth.guard';
import { FullUserDto } from '../user/dto/full-user.dto';
import { ReqUser } from '../auth/decorators/user.decorator';
import { CanvasOwnerGuard } from './guards/canvas-owner.guard';
import { UpdateCanvasDto } from './dto/update-canvas.dto';

@Controller({
  path: 'canvas',
  version: '1',
})
@SetMetadata('class_serializer:options', { strategy: 'exposeAll' })
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @UseGuards(AccessAuthGuard)
  @Post()
  async create(
    @ReqUser() user: FullUserDto,
    @Body() canvas: CreateCanvasDto,
  ): Promise<FullCanvasDto> {
    const newCanvas: FullCanvasDto = await this.canvasService.create(
      canvas,
      user._id,
    );

    return plainToInstance(FullCanvasDto, newCanvas);
  }

  @UseGuards(AccessAuthGuard, CanvasOwnerGuard)
  @Patch(':id')
  async update(
    @Param('id') canvasId: string,
    @Body() canvas: UpdateCanvasDto,
  ): Promise<FullCanvasDto> {
    const updatedCanvas: FullCanvasDto = await this.canvasService.update(
      canvasId,
      canvas,
    );

    return plainToInstance(FullCanvasDto, updatedCanvas);
  }

  @UseGuards(AccessAuthGuard, CanvasOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') canvasId: string): Promise<void> {
    await this.canvasService.delete(canvasId);
  }
}
