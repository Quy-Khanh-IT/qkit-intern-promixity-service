import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { ReviewTypeEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

import { UserSchema } from './review.entity';

// Implement bucket model

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Comment extends BaseEntity {
  @Transform(
    (value) => {
      return value.obj?._id?.toString();
    },
    {
      toClassOnly: true,
    },
  )
  @Expose()
  id?: string;

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  @Exclude()
  reviewId: Types.ObjectId;

  @Transform(
    (value) => {
      return value.obj?.reviewId?.toString();
    },
    {
      toClassOnly: true,
    },
  )
  @Expose()
  review_id?: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  @Exclude()
  parentId: Types.ObjectId;

  @Transform(
    (value) => {
      return value.obj?.parentId?.toString();
    },
    {
      toClassOnly: true,
    },
  )
  @Expose()
  parent_id?: string;

  @Prop({ default: null })
  page: number | null;

  @Prop({ type: Number, default: null })
  _page: number | null;

  @Prop({ required: true, type: UserSchema })
  @Type(() => UserSchema)
  postBy: UserSchema;

  @Prop({ default: 0, max: 5 })
  count: number;

  @Prop({ default: 0 })
  depth: number;

  @Prop({ default: null })
  left: number | null;

  @Prop({ default: null })
  right: number | null;

  @Prop({ default: false })
  isBusinessOwner: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ required: true, trim: true, maxlength: 255 })
  content: string;

  @Prop({ enum: ReviewTypeEnum, required: true })
  type: string;

  @Prop({ default: [] })
  replies: this[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;

CommentSchema.index({ left: 1 });
CommentSchema.index({ right: 1 });
CommentSchema.index({ reviewId: 1 });
CommentSchema.index({ page: 1 });
