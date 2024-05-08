import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId;

  // Transform _id to id
  id?: string;

  @Prop({ default: null })
  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  __v?: number;
}
