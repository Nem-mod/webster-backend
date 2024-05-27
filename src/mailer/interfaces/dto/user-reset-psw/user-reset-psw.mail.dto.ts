import { UserResetPswPayloadDto } from './user-reset-psw.payload.dto';
import { BaseMailDto } from '../base.mail.dto';
import { IntersectionType } from '@nestjs/swagger';

export class UserResetPswMailDto extends IntersectionType(
  BaseMailDto,
  UserResetPswPayloadDto,
) {}
