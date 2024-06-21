import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { EmotionEnum, ReviewTypeEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

// Implement bucket model

export class UserSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  @Exclude()
  userId: Types.ObjectId;

  @Prop({ trim: true })
  user_id?: string;

  @Prop({ trim: true })
  lastName: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true, default: '' })
  avatarUrl: string;
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Review extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  @Exclude()
  businessId: Types.ObjectId;

  @Transform((value) => value.obj?.businessId?.toString(), {
    toClassOnly: true,
  })
  @Expose()
  business_id?: string;

  @Prop({ required: true, trim: true, default: 0 })
  page: number;

  @Prop({ required: true, type: UserSchema })
  postBy: UserSchema;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ enum: ReviewTypeEnum, required: true })
  type: string;

  @Prop({ enum: EmotionEnum, required: false, default: EmotionEnum.NORMAL })
  emotion: string;

  @Prop({ enum: [1, 2, 3, 4, 5], default: null })
  star: number | null;

  @Prop({ default: 0, required: false })
  reportedCount: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export type ReviewDocument = HydratedDocument<Review>;
