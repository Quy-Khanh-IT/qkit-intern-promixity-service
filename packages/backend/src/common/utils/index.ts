import * as argon2 from 'argon2';
import { ObjectId } from 'mongoose';

export const hashString = async (str: string) => {
  return await argon2.hash(str);
};

export const transObjectIdToString = (id: ObjectId) => {
  return id.toString();
};
