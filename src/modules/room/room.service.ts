import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './entities/room.entity';
import { MessageService } from 'modules/message/message.service';
import { UsersService } from 'modules/users/users.service';
import { QueryOption } from 'tools';
import { ResponseDTO } from 'common';
import { UserDocument } from 'modules/users/entities';
import { ResponseMessage } from 'utils';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  /** COMMONS */

  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.roomModel.countDocuments(conditions).exec()
      : this.roomModel.estimatedDocumentCount().exec();
  }

  async findAll(
    option: QueryOption,
    conditions: any = {},
  ): Promise<RoomDocument[]> {
    return this.roomModel
      .find(conditions)
      .sort(option.sort)
      .skip(option.skip as number)
      .limit(option.limit as number);
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

  async findById(id: string) {
    return await this.roomModel
      .findById(id)
      .populate({
        path: 'members',
      })
      .exec();
  }

  async findDmRoom(
    userIdA: string,
    userIdB: string,
  ): Promise<RoomDocument | null> {
    const [userA, userB] = await Promise.all(
      [userIdA, userIdB].map(async (userId) => {
        return await this.userService.findById(userId);
      }),
    );

    // check if userA and userB are in the same room
    const room = await this.roomModel
      .findOne({
        $or: [
          {
            owner: userA,
            members: userB,
            isDm: true,
          },
          {
            owner: userB,
            members: userA,
            isDm: true,
          },
        ],
      })
      .populate({
        path: 'members',
      })
      .exec();

    return room;
  }

  async getRoomByUser(user: UserDocument) {
    const response = await this.roomModel
      .find({
        $or: [
          {
            owner: user,
          },
          {
            members: user,
          },
        ],
      })
      .populate({
        path: 'members',
      })
      .exec();

    return response;
  }

  async getDMRoomOfUser(userAId: string, userBId: string) {
    const [userA, userB] = await Promise.all(
      [userAId, userBId].map(async (userId) => {
        return await this.userService.findById(userId);
      }),
    );

    const room = await this.roomModel
      .findOne({
        $or: [
          {
            owner: userA,
            members: userB,
            isDm: true,
          },
          {
            owner: userB,
            members: userA,
            isDm: true,
          },
        ],
      })
      .exec();

    if (!room) {
      return ResponseMessage(`Room not found!`, 'BAD_REQUEST');
    }

    return room;
  }
}
