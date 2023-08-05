import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
import { Schema as MongoSchema } from 'mongoose';
import { EAudience, EGender } from '../../../constants';
import { BCRYPT_HASH_NUMBER, USER_CONST, USER_MODEL } from '../constants';

@Schema({
  timestamps: true,
  collection: USER_MODEL,
  toJSON: { virtuals: true },
})
export class User {
  @IsString()
  @Prop({
    type: String,
    index: true,
    trim: true,
    maxlength: USER_CONST.NAME_MAX_LENGTH,
  })
  name: string;

  @IsString()
  @Prop({
    type: String,
    index: true,
    trim: true,
  })
  bio: string;

  @IsString()
  @Prop({
    type: String,
    index: true,
    trim: true,
  })
  avatar: string;

  @IsString()
  @Prop({
    type: String,
    index: true,
    trim: true,
  })
  coverPhoto: string;

  @IsString()
  @Length(USER_CONST.USERNAME_MIN_LENGTH, USER_CONST.USERNAME_MAX_LENGTH)
  @Prop({
    type: String,
    index: true,
    required: true,
    trim: true,
  })
  username: string;

  @IsString()
  @Length(USER_CONST.PASSWORD_MIN_LENGTH, USER_CONST.PASSWORD_MAX_LENGTH)
  @Prop({
    type: String,
    index: true,
    required: true,
    trim: true,
  })
  password: string;

  @IsString()
  @Length(USER_CONST.PASSWORD_MIN_LENGTH, USER_CONST.PASSWORD_MAX_LENGTH)
  @Prop({
    type: String,
    index: true,
    trim: true,
  })
  passwordConfirm: string;

  @IsEmail()
  @Prop({
    type: String,
    index: true,
    trim: true,
  })
  email: string;

  @Prop({
    enum: Object.values(EGender),
    default: EGender.UNKNOWN,
  })
  gender: EGender;

  @Prop({
    type: Date,
  })
  birthday: Date;

  @Prop(
    raw({
      id: {
        type: String,
      },
    }),
  )
  facebook: {
    id: string;
  };

  @Prop(
    raw({
      id: {
        type: String,
      },
    }),
  )
  google: {
    id: string;
  };

  @Prop(
    raw({
      id: {
        type: String,
      },
    }),
  )
  github: {
    id: string;
  };

  @Prop()
  isThirdParty: boolean;

  @Prop()
  jti: string;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: User.name }] })
  followers: UserDocument[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: User.name }] })
  following: UserDocument[];

  @Prop({
    enum: Object.values(EAudience),
    default: EAudience.PUBLIC,
  })
  storyAudience: EAudience;

  @Prop({
    type: String,
    default: 'active',
  })
  status: string;

  @IsString()
  @Prop({
    type: String,
    index: true,
    required: true,
    trim: true,
    default: 'user',
  })
  role: string;

  @IsNumber()
  @Prop({
    type: Number,
    default: 0,
  })
  reportedCount: number;

  @Prop()
  callingId: string;
  socketId: string;

  comparePassword: (password: string) => Promise<boolean>;
  checkPasswordConfirm: () => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  const password = this.get('password');
  console.log('🚀 ~ password on save: ~ ', password);
  if (password) {
    const newPassword = password
      ? await bcrypt.hash(password, BCRYPT_HASH_NUMBER)
      : null;

    this.set('passwordConfirm', null);
    this.set('password', newPassword);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(
  password: string,
): Promise<boolean> {
  return bcrypt.compare(
    password,
    (this as unknown as User).password.toString(),
  );
};

UserSchema.methods.checkPasswordConfirm = function () {
  return this.get('password') === this.get('passwordConfirm');
};

export interface UserDocument extends User, Document {}
