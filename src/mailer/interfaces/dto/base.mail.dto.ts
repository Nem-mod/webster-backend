import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseMailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  returnLink: string;
}
