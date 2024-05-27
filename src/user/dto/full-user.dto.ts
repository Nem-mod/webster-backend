import { UpdateUserDto } from './update-user.dto';
import { PartialType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class FullUserDto extends PartialType(UpdateUserDto) {
  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id?: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose()
  email: string;

  @Expose()
  verified: boolean;
}
