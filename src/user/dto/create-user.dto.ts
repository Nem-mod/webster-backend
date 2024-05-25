import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

const PSW_MIN_LEN = 8;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @MinLength(PSW_MIN_LEN, { message: `Min password length is ${PSW_MIN_LEN}` })
  password: string;

  @IsEmail()
  email: string;
}
