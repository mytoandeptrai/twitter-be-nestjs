import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'modules/auth/auth.module';
import { TokenModule } from 'modules/token/token.module';
import { UploadModule } from 'modules/upload/upload.module';
import { UsersModule } from 'modules/users/users.module';
import { DATABASE_URL } from './constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    ConfigModule.forRoot(),
    UsersModule,
    TokenModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
