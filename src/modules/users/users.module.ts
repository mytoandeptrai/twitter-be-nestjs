import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UserRepository],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
