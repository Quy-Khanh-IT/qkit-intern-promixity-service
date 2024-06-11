import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class UserSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Transform((value) => value.obj?.userId?.toString(), {
    toClassOnly: true,
  })
  @Expose()
  user_id: string;

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
export class ResponseSchema {
  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  @Exclude()
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  //   @Exclude()
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
  review_id: string;

  @Prop({ required: true, type: UserSchema })
  postBy: UserSchema;

  @Prop()
  content: string;

  @Prop()
  depth: number;
}

export const ResponseSchemaSchema =
  SchemaFactory.createForClass(ResponseSchema);
export type ResponseSchemaDocument = HydratedDocument<ResponseSchema>;
