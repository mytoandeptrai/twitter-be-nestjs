import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TweetModule } from 'modules/tweet/tweet.module';
import { User, UserSchema } from './entities';
import { UserRepository } from './repository';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => TweetModule),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
