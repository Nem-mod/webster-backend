import { MinLength } from 'class-validator';

const PSW_MIN_LEN = 8;

export class CreatePasswordDto {
  @MinLength(PSW_MIN_LEN, { message: `Min password length is ${PSW_MIN_LEN}` })
  password: string;
}
