import * as argon2 from 'argon2';
import mongoose, { ObjectId } from 'mongoose';

export const hashString = async (str: string) => {
  return await argon2.hash(str);
};

export const verifyHash = async (hash: string, str: string) => {
  return await argon2.verify(hash, str);
};

export const transObjectIdToString = (id: ObjectId) => {
  return id.toString();
};

export const transStringToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};
