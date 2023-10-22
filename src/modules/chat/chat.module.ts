import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_EXP, JWT_SECRET } from '../../constants';
import { AuthModule } from 'modules/auth/auth.module';
import { MessageSchema } from 'modules/message/entities';
import { MessageModule } from 'modules/message/message.module';
import { RoomModule } from 'modules/room/room.module';
import { UsersModule } from 'modules/users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXP,
      },
    }),
    AuthModule,
    UsersModule,
    MessageModule,
    RoomModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatModule {}
