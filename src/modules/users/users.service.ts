import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ResponseDTO } from 'common';
import { Model } from 'mongoose';
import { QueryOption, QueryPostOption } from 'tools';
import { ResponseMessage } from 'utils';
import { MSG, ROOT_ROLES } from '../../constants';
import { REGEX_EMAIL, REGEX_USER } from './constants';
import { UpdateUserDTO } from './dto';
import { User, UserDocument } from './entities';
import { UserRepository } from './repository';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly userRepository: UserRepository,
  ) {}

  /** COMMON FUNCTIONS */

  deleteUnnecessaryFieldsForUpdating(user: UpdateUserDTO) {
    delete user.oldPassword;
    delete user.newPassword;
    delete user.newPasswordConfirm;
  }

  count({ conditions }: { conditions?: any } = {}): Promise<number> {
    return Object.keys(conditions || {}).length > 0
      ? this.userModel.countDocuments(conditions).exec()
      : this.userModel.estimatedDocumentCount().exec();
  }

  async validateUsernameOrEmail(username?: string): Promise<boolean> {
    if (!username) return false;
    return REGEX_USER.test(username) || REGEX_EMAIL.test(username);
  }

  async generateNewPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /** QUERIES */

  async findAll(
    option: QueryOption,
    conditions: any = {},
  ): Promise<UserDocument[]> {
    return this.userRepository.findAll(option, conditions);
  }

  async findAllAndCount(
    option: QueryOption,
    conditions: any = {},
  ): Promise<ResponseDTO> {
    const response = this.findAll(option, conditions);
    const count = this.count({ conditions });
    const [data, total] = await Promise.all([response, count]);

    return { data, total };
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (user?.status.toString() !== 'active') {
      return ResponseMessage(`${user?.name} was banned`, 'BAD_REQUEST');
    }

    return user;
  }

  async findByIdAdmin(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.userRepository.findByUsernameOrEmail(usernameOrEmail);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByGoogleId(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        'google.id': id,
      })
      .exec();
  }

  async search(search: string, query: QueryPostOption) {
    const conditions = {
      role: { $eq: 'user' },
      $or: [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          username: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          id: search,
        },
        {
          status: {
            $regex: search,
          },
        },
      ],
    };

    return this.findAllAndCount(query.options as QueryOption, conditions);
  }

  async getUserList(query: QueryPostOption) {
    const conditions = {
      role: { $eq: 'user' },
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    };

    return this.findAllAndCount(query.options as QueryOption, conditions);
  }

  /** MUTATIONS */

  async createUser(user: Partial<User>): Promise<UserDocument> {
    const validateUsernameOrEmail = await this.validateUsernameOrEmail(
      user.username,
    );

    if (!validateUsernameOrEmail) {
      return ResponseMessage(`${MSG.FRONTEND.INVALID_USERNAME}`, 'BAD_REQUEST');
    }

    const createdUser = new this.userModel(user);

    const existedUserEmail = await this.checkIfEmailAlreadyTakenByOtherUser(
      createdUser.email,
      createdUser.id.toString(),
    );

    if (existedUserEmail) {
      return ResponseMessage('Email is already taken', 'BAD_REQUEST');
    }

    if (!createdUser.checkPasswordConfirm()) {
      return ResponseMessage(
        'Password and confirm password are not equal',
        'BAD_REQUEST',
      );
    }

    try {
      await createdUser.save();
      return createdUser;
    } catch (error) {
      return ResponseMessage(`${error}`, 'SERVICE_UNAVAILABLE');
    }
  }

  async preUpdateUser(userId: string, newUserInfo: UpdateUserDTO) {
    const user = await this.findById(userId);
    if (!user) {
      return ResponseMessage('User does not exist', 'BAD_REQUEST');
    }

    const userEmail = newUserInfo?.email;
    let userPassword = newUserInfo?.password;
    const userNewPassword = newUserInfo?.newPassword;

    if (userEmail) {
      await this.checkIfEmailIsAvailable(userEmail, userId);
    }

    if (userPassword) {
      userPassword = await this.generateNewPassword(userPassword);
    }

    if (newUserInfo.oldPassword) {
      const isPasswordCorrect = await this.checkIfPasswordIsCorrect(
        user,
        newUserInfo.oldPassword,
      );
      if (!isPasswordCorrect) {
        return ResponseMessage('Old password is not valid', 'BAD_REQUEST');
      }
      newUserInfo.password = await this.generateNewPassword(
        userNewPassword as string,
      );

      this.deleteUnnecessaryFieldsForUpdating(newUserInfo);
    }

    return newUserInfo;
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<UserDocument> {
    try {
      const newUserInfo = await this.preUpdateUser(userId, data);
      const responseData = await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        newUserInfo,
        {
          new: true,
        },
      );

      return responseData as UserDocument;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUserById(
    userId: string,
    data: UpdateUserDTO,
    requestUser: UserDocument,
  ): Promise<UserDocument> {
    if (!this.isAdminRole(requestUser)) {
      return ResponseMessage('You are not an admin', 'METHOD_NOT_ALLOWED');
    }

    return this.updateUser(userId, data);
  }

  async followUser(user: UserDocument, userToFollowId: string) {
    try {
      const userId = user._id.toString();
      if (userId === userToFollowId) {
        return ResponseMessage('User can not follow yourself', 'BAD_REQUEST');
      }

      const hasFollowed = user.following.findIndex(
        (user) => user._id.toString() === userToFollowId,
      );

      if (hasFollowed > -1) {
        return ResponseMessage('You followed this user', 'BAD_REQUEST');
      }
      const userToFollow = await this.findById(userToFollowId);
      if (!userToFollow) {
        return ResponseMessage('This user does not exist', 'BAD_REQUEST');
      }

      await this.userModel.findOneAndUpdate(
        { _id: userToFollowId },
        {
          $push: { followers: userId },
        },
      );

      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: { following: userToFollowId },
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async unFollowUser(user: UserDocument, userToUnFollowId: string) {
    try {
      const userId = user._id.toString();
      if (userId === userToUnFollowId) {
        return ResponseMessage('User can not unFollow yourself', 'BAD_REQUEST');
      }

      const hasFollowed = user.following.findIndex(
        (user) => user._id.toString() === userToUnFollowId,
      );
      if (hasFollowed === -1) {
        return ResponseMessage(
          'You have not followed this user before',
          'BAD_REQUEST',
        );
      }

      const userToUnFollow = await this.findById(userToUnFollowId);

      if (!userToUnFollow) {
        return ResponseMessage('This user does not exist', 'BAD_REQUEST');
      }

      await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { following: userToUnFollowId },
        },
      );

      await this.userModel.findOneAndUpdate(
        { _id: userToUnFollowId },
        {
          $pull: { followers: userId },
        },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async reportUser(userId: string) {
    const user = await this.findById(userId);
    if (user) {
      user.reportedCount = +(user.reportedCount || 0) + 1;
      return this.userModel.findByIdAndUpdate(userId, {
        reportedCount: user.reportedCount,
      });
    } else {
      return ResponseMessage('This user does not exist', 'BAD_REQUEST');
    }
  }

  async followAnonymous({
    userAId,
    userBId,
  }: {
    userAId: string;
    userBId: string;
  }) {
    const userA = await this.findById(userAId);
    if (!userA.following.some((user) => user._id.toString() === userBId)) {
      const userB = await this.findById(userBId);
      userA.following.push(userB);
      userB.followers.push(userA);
      await this.userModel.findByIdAndUpdate(userA._id, {
        following: userA.following,
      });
      await this.userModel.findByIdAndUpdate(userB._id, {
        followers: userB.followers,
      });
    }
  }

  async updateBanStatusOfUser(
    requestUser: UserDocument,
    banStatus: string,
    userId: string,
  ): Promise<UserDocument> {
    if (!this.isAdminRole(requestUser)) {
      return ResponseMessage('You are not an admin', 'METHOD_NOT_ALLOWED');
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        status: banStatus,
      },
      { new: true },
    );

    return updatedUser as UserDocument;
  }

  /** CHECKING FUNCTIONS */

  isAdminRole(requestUser: UserDocument): boolean {
    return ROOT_ROLES.includes(requestUser.role);
  }

  async checkIfPasswordIsCorrect(
    user: UserDocument,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, user.password.toString());
  }

  async checkIfEmailAlreadyTakenByOtherUser(
    email: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      return false;
    }

    return user && user?._id && user._id.toString() != userId;
  }

  async checkIfEmailIsAvailable(email: string, userId: string): Promise<void> {
    const validateUsernameOrEmail = await this.validateUsernameOrEmail(email);
    if (!validateUsernameOrEmail) {
      return ResponseMessage('Invalid Email', 'BAD_REQUEST');
    }

    const isEmailAlreadyTakenByOtherUser =
      await this.checkIfEmailAlreadyTakenByOtherUser(email, userId);

    if (isEmailAlreadyTakenByOtherUser) {
      return ResponseMessage('Email is already taken', 'BAD_REQUEST');
    }
  }
}
