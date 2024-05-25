import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Ownership } from './models/ownership.model';
import { Model } from 'mongoose';
import { OwnershipDto } from './dto/ownership.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { FullUserDto } from '../dto/full-user.dto';

@Injectable()
export class OwnershipService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Ownership.name)
    private readonly ownershipModel: Model<Ownership>,
  ) {}

  async isOwner(ownership: OwnershipDto, userId: string): Promise<boolean> {
    userId = userId.toString();
    return ownership.owners.some((obj) => {
      let id: string;
      if (obj instanceof FullUserDto) {
        id = obj._id.toString();
      } else {
        id = obj.toString();
      }
      return id === userId;
    });
  }

  async isGuest(ownership: OwnershipDto, userId: string): Promise<boolean> {
    userId = userId.toString();
    return ownership.guests.some((obj) => {
      let id: string;
      if (obj instanceof FullUserDto) {
        id = obj._id.toString();
      } else {
        id = obj.toString();
      }
      return id === userId;
    });
  }

  async isMember(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<'owner' | 'guest' | null> {
    if (await this.isOwner(ownership, userId)) return 'owner';
    if (await this.isGuest(ownership, userId)) return `guest`;
    return null;
  }

  async createOwnershipModel(ownership: OwnershipDto): Promise<Ownership> {
    const newOwnership: Ownership = new this.ownershipModel(ownership);
    return newOwnership;
  }

  async getAllUsersIds(ownership: OwnershipDto): Promise<string[]> {
    return ownership.owners.concat(ownership.guests).map((user) => {
      if (user instanceof FullUserDto) {
        return user._id;
      } else {
        return user;
      }
    });
  }

  async addGuest(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    ownership.guests = [...new Set([...ownership.guests, userId])]; //TODO: maybe just change to push because of bad performance

    return ownership;
  }

  async addOwner(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    ownership.owners = [...new Set([...ownership.owners, userId])]; //TODO: maybe just change to push because of bad performance

    return ownership;
  }

  async removeMember(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    ownership = await this.removeGuest(ownership, userId);
    ownership = await this.removeOwner(ownership, userId);

    return ownership;
  }

  async removeGuest(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    userId = userId.toString();
    ownership.guests = ownership.guests.filter((guest) => {
      if (guest instanceof FullUserDto) {
        return guest._id.toString() !== userId;
      } else {
        return guest.toString() !== userId;
      }
    });
    return ownership;
  }

  async removeOwner(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    userId = userId.toString();
    ownership.owners = ownership.owners.filter((owner) => {
      if (owner instanceof FullUserDto) {
        return owner._id.toString() !== userId;
      } else {
        return owner.toString() !== userId;
      }
    });
    return ownership;
  }

  async promoteGuestToOwner(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    if (await this.isGuest(ownership, userId)) {
      ownership = await this.removeGuest(ownership, userId);
      ownership = await this.addOwner(ownership, userId);
    } else {
      throw new NotFoundException(`User is not a guest`);
    }

    return ownership;
  }

  async demoteOwnerToGuest(
    ownership: OwnershipDto,
    userId: string,
  ): Promise<OwnershipDto> {
    if (await this.isOwner(ownership, userId)) {
      ownership = await this.removeOwner(ownership, userId);
      ownership = await this.addGuest(ownership, userId);
    } else {
      throw new NotFoundException(`User is not an owner`);
    }

    return ownership;
  }
}
