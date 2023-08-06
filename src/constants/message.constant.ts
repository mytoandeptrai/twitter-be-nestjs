import { msg } from 'json';

export const MSG = msg;

export enum EGender {
  MALE,
  FEMALE,
  UNKNOWN,
}

export enum EAudience {
  PUBLIC,
  FOLLOWERS,
  ONLY_ME,
}

export const EGenderConstant = {
  MALE: 0,
  FEMALE: 1,
  UNKNOWN: 2,
};

export const EAudienceConstant = {
  PUBLIC: 0,
  FOLLOWERS: 1,
  ONLY_ME: 2,
};
