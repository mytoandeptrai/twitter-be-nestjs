import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from 'modules/token/token.module';
import { DATABASE_URL } from './constants';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    UsersModule,
    TokenModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
