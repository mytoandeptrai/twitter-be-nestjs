import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'modules/users/users.module';
import { Message, MessageSchema } from './entities';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
