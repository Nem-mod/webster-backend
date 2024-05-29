import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ownership, OwnershipSchema } from './ownership/models/ownership.model';
import { MailerModule } from '../mailer/mailer.module';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
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
