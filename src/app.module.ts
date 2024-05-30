import { Module } from '@nestjs/common';
import { MailerModule } from './mailer/mailer.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { NestRedisOmModule } from './redis-om/nest.redis-om.module';
import { TokenModule } from './token/token.module';
import { AuthModule } from './auth/auth.module';
import { UploaderModule } from './uploader/uploader.module';
import { CanvasModule } from './canvas/canvas.module';

@Module({
  imports: [
    // TODO: Add logger globally
    MailerModule,
    NestRedisOmModule,
    UserModule,
    TokenModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(`db.mongodb.uri`),
      }),
      inject: [ConfigService],
    }),
    UploaderModule,
    CanvasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
