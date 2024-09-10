import { Prop } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  @Exclude()
  _id?: ObjectId;

  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id?: string;

  @Prop({ default: null })
  deleted_at?: Date;

  created_at?: Date;

  updated_at?: Date;

  __v?: number;
}
