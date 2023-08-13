import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'modules/auth/auth.module';
import { TokenModule } from 'modules/token/token.module';
import { TweetModule } from 'modules/tweet/tweet.module';
import { UploadModule } from 'modules/upload/upload.module';
import { UsersModule } from 'modules/users/users.module';
import { DATABASE_URL } from './constants';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    ConfigModule.forRoot(),
    UsersModule,
    TokenModule,
    AuthModule,
    UploadModule,
    TweetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
