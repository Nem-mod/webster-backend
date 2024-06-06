import { Expose, Transform } from 'class-transformer';
import { FullUserDto } from '../../user/dto/full-user.dto';

export class FullCanvasDto {
  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Expose()
  canvasName: string;

  @Expose()
  resolution: [number, number];

  @Expose()
  canvas: object;

  @Expose()
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true }) // TODO: what if FullUserDto.toString()?
  user: string | FullUserDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
