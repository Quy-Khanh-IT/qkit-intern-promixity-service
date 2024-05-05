import { required } from '@hapi/joi';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class Token extends BaseEntity {
  @Prop({ required: true, trim: true })
  token: string;

  @Prop({ required: true, trim: true, type: Types.ObjectId })
  userId: ObjectId;

  @Prop({
    required: true,
    name: 'expired_at',
  })
  expiredAt: Date;

  @Prop({ required: true, default: false })
  used: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index(
  { expiredAt: 1 },
  { expireAfterSeconds: 0, background: true, name: 'expired_at_index' },
);
