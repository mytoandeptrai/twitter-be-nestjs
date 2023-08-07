import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'modules/auth/auth.module';
import { TokenModule } from 'modules/token/token.module';
import { UploadModule } from 'modules/upload/upload.module';
import { UsersModule } from 'modules/users/users.module';
import { DATABASE_URL } from './constants';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    UsersModule,
    TokenModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
