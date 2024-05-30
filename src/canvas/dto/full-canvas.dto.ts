import { Expose, Transform } from 'class-transformer';

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
}
