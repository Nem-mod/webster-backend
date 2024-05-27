import { UserVerificationPayloadDto } from './user-verification.payload.dto';
import { BaseMailDto } from '../base.mail.dto';
import { IntersectionType } from '@nestjs/swagger';

export class UserVerificationMailDto extends IntersectionType(
  BaseMailDto,
  UserVerificationPayloadDto,
) {}
