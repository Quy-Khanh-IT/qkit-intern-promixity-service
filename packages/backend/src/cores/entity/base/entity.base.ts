import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId;

  // Transform _id to id
  id?: string;

  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
