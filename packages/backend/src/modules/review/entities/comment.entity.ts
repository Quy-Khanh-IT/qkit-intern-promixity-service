import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { ReviewTypeEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

// Implement bucket model

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ResponseSchema {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId | null;

  @Prop()
  reviewId: Types.ObjectId;

  @Prop({ required: true, type: Object })
  postBy: {
    userId: Types.ObjectId;
    firstName: string;
    avatarUrl: string;
  };

  @Prop()
  content: string;

  @Prop()
  depth: number;
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Comment extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Review', default: null })
  @Exclude()
  reviewId: Types.ObjectId;

  @Transform((value) => value.obj?.reviewId?.toString(), {
    toClassOnly: true,
  })
  @Expose()
  review_id?: string;

  @Prop({ default: null })
  page: number | null;

  @Prop({ required: true, type: Number })
  _page: number;

  @Prop({ required: true, type: Object })
  postBy: {
    userId: Types.ObjectId;
    firstName: string;
    avatarUrl: string;
  };

  @Prop({ default: 0, max: 5 })
  count: number;

  @Prop({ default: 0, max: 3 })
  depth: number;

  @Prop({ required: true, trim: true, maxlength: 255 })
  content: string;

  @Prop({ enum: ReviewTypeEnum, required: true })
  type: string;

  @Prop({ default: [], type: [ResponseSchema] })
  replies: ResponseSchema[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;
