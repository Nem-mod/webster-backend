import { IsOptional, IsString } from 'class-validator';

export class UserVerificationPayloadDto {
  @IsString()
  @IsOptional()
  id: string = null;
}
