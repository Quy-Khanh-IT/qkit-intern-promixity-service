import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId;

  // Transform _id to id
  id?: string;

  @Prop({ default: null })
  deleted_at?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  __v?: number;
}
