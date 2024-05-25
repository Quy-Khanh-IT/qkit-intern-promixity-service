import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { Image } from 'src/modules/business/entities/image.entity';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Review extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Review', default: null })
  parent_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({})
  star: number | null;

  @Prop({ type: Image })
  image: Image;

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  replies: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  depth: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  business_id: Types.ObjectId;

  @Prop({ default: null })
  deleted_at: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export type ReviewDocument = HydratedDocument<Review>;
