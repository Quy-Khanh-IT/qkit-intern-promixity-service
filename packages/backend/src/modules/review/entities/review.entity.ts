import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { ReviewTypeEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Review extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Review', default: null })
  @Exclude()
  parentId: Types.ObjectId;

  @Transform((value) => value.obj?.businessId?.toString(), {
    toClassOnly: true,
  })
  @Expose()
  parent_id?: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ enum: [1, 2, 3, 4, 5], default: null })
  star: number | null;

  @Prop({ enum: ReviewTypeEnum, required: true })
  type: ReviewTypeEnum;

  @Prop({ type: Number, default: 0, max: 2 })
  depth: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  @Exclude()
  senderId: Types.ObjectId;

  @Transform((value) => value.obj?.userId?.toString(), { toClassOnly: true })
  @Expose()
  sender_id?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  @Exclude()
  receiverId: Types.ObjectId;

  @Transform((value) => value.obj?.userId?.toString(), { toClassOnly: true })
  @Expose()
  receiver_id?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  @Exclude()
  businessId: Types.ObjectId;

  @Transform((value) => value.obj?.businessId?.toString(), {
    toClassOnly: true,
  })
  @Expose()
  business_id?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export type ReviewDocument = HydratedDocument<Review>;

ReviewSchema.index({ businessId: 1 });
ReviewSchema.index({ receiverId: 1 });
ReviewSchema.index({ senderId: 1 });
