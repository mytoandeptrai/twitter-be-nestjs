import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from 'modules/token/token.module';
import { DATABASE_URL } from './constants';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_URL), UsersModule, TokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
