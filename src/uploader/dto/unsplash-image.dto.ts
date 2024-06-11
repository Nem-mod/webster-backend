import { Expose, Transform } from 'class-transformer';

export class UnsplashImageDto {
  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Expose()
  url: string;
}
