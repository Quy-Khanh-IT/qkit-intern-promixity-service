import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';

@Schema({})
export class CategorySchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  @Exclude()
  _id: ObjectId;

  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  id?: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  linkURL: string;
}
