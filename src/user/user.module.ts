import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { OwnershipService } from './ownership/ownership.service';
import { Ownership, OwnershipSchema } from './ownership/models/ownership.model';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ownership.name, schema: OwnershipSchema },
    ]),
    MailerModule,
  ],
  providers: [UserService /*, OwnershipService*/],
  exports: [UserService /*, OwnershipService*/],
})
export class UserModule {}
