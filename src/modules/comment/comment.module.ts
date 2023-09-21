import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TweetModule } from 'modules/tweet/tweet.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => TweetModule),
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
