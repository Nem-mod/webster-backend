import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FullUserDto } from './dto/full-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto): Promise<FullUserDto> {
    user.password = bcrypt.hashSync(
      user.password,
      this.configService.get<number>(`crypt.salt`),
    );

    const newUser: User = new this.userModel(user);

    try {
      await newUser.save();
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`User already exists`);
      console.error(err);
      throw err;
    }

    return newUser.toObject();
  }

  async findByUsername(
    username: CreateUserDto[`username`],
  ): Promise<FullUserDto> {
    const user: FullUserDto = await this.userModel.findOne({ username }).lean();
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async findByEmail(email: CreateUserDto[`email`]): Promise<FullUserDto> {
    const user: FullUserDto = await this.userModel.findOne({ email }).lean();
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async findById(id: string): Promise<FullUserDto> {
    const user: FullUserDto = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async update(id: string, user: UpdateUserDto): Promise<FullUserDto> {
    delete user.password;

    try {
      return await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
        projection: { password: 0 },
      });
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`Some fields are already in use`);
      console.error(err);
      throw err;
    }
  }

  async updatePassword(id: string, password: string): Promise<FullUserDto> {
    try {
      password = bcrypt.hashSync(
        password,
        this.configService.get<number>(`crypt.salt`),
      );

      return await this.userModel.findByIdAndUpdate(
        id,
        { password },
        {
          new: true,
          projection: { password: 0 }, // TODO: make password hidden everywhere
        },
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async verify(id: string): Promise<void> {
    const user: User = await this.userModel.findByIdAndUpdate(id, {
      verified: true,
    });
    if (!user) throw new NotFoundException(`User not found`);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException(`User not found`);
  }
}
