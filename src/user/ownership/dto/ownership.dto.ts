import { FullUserDto } from '../../dto/full-user.dto';
import { CreateUserDto } from '../../dto/create-user.dto';

export class OwnershipDto {
  owners: (FullUserDto | string)[];
  guests: (FullUserDto | string)[];
}
