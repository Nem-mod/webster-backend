import { UpdateUserDto } from './update-user.dto';
import { PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class FullUserDto extends PartialType(UpdateUserDto) {
  @Expose()
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
