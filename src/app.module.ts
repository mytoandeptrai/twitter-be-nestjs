import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'modules/auth/auth.module';
import { ChatModule } from 'modules/chat/chat.module';
import { CommentModule } from 'modules/comment/comment.module';
import { HashtagModule } from 'modules/hashtag/hashtag.module';
import { LinkPreviewModule } from 'modules/link-preview/link-preview.module';
import { MessageModule } from 'modules/message/message.module';
import { NotificationModule } from 'modules/notification/notification.module';
import { RoomModule } from 'modules/room/room.module';
import { SearchModule } from 'modules/search/search.module';
import { StoryModule } from 'modules/story/story.module';
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
    HashtagModule,
    SearchModule,
    LinkPreviewModule,
    StoryModule,
    CommentModule,
    NotificationModule,
    MessageModule,
    RoomModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
