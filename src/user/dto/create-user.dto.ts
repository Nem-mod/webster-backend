import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreatePasswordDto } from './create-password.dto';

export class CreateUserDto extends CreatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;
}
