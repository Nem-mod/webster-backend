import { IsNotEmpty, IsString } from 'class-validator';

export class UserResetPswPayloadDto {
  @IsString()
  @IsNotEmpty()
  id: string = null;
}
