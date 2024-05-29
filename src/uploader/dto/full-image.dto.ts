import { Expose, Transform } from 'class-transformer';
import { FullUserDto } from '../../user/dto/full-user.dto';

export class FullImageDto {
  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: string;

  @Expose()
  url: string;

  @Expose()
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true }) // TODO: what if FullUserDto.toString()?
  user: string | FullUserDto;

  @Expose()
  updatedAt: string;
}
