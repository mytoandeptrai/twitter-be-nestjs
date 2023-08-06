import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { QueryOption } from 'tools';
import { ResponseMessage } from 'utils';
import { REGEX_EMAIL, REGEX_USER } from './constants';
import { User, UserDocument } from './entities';
import { UserRepository } from './repository';
import { UpdateUserDTO } from './dto';
import { ResponseDTO } from 'common';
import { EAudience, MSG } from '../../constants';

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

  /** CHECKING FUNCTIONS */

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
