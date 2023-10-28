import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseDTO } from 'common';
import _ from 'lodash';
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { CreateMessageDTO } from './dto';

import { Message, MessageDocument } from './entities';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  /** COMMONS */
  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.messageModel.countDocuments(conditions).exec()
      : this.messageModel.estimatedDocumentCount().exec();
  }

  async findAll(option: QueryOption, conditions: any = {}): Promise<Message[]> {
    return this.messageModel
      .find(conditions)
      .sort({
        ...option.sort,
        createdAt: -1,
      })
      .skip(option.skip as number)
      .limit(option.limit as number)
      .populate('author', '_id name avatar');
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const data = await this.findAll(option, conditions);
    const total = await this.count({ conditions });
    return { data, total };
  }

  /** QUERIES */

  async findById(id: string): Promise<MessageDocument | null> {
    return await this.messageModel.findById(id).lean();
  }

  async getRoomMessage(
    roomId: string,
    option: QueryOption,
  ): Promise<ResponseDTO> {
    const conditions = {
      roomId: roomId.toString(),
    };

    const response = await this.findAllAndCount(option, conditions);
    return response;
  }

  /** MUTATIONS */

  async createMessage(
    messageDto: CreateMessageDTO,
    roomId: string,
  ): Promise<MessageDocument | null> {
    const newMessage = new this.messageModel({
      ..._.omit(messageDto, ['_id']),
      roomId: roomId,
      createdAt: new Date(),
    });
    return await newMessage.save();
  }

  async deleteMessages(roomId: string) {
    return await this.messageModel.deleteMany({ roomId });
  }
}
