import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId,Types } from 'mongoose';

import { TypeRequests } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { User } from 'src/modules/user/entities/user.entity';

export type RequestDocument = HydratedDocument<Requests>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class Requests extends BaseEntity {
  @Prop({ required: true, trim: true })
  token: string;

  @Prop({ required: true, trim: true, type: Types.ObjectId, ref: User.name })
  userId: ObjectId;
  //host/users/requeset-reset-email
  @Prop({
    required: true,
    name: 'expired_at',
  })
  expiredAt: Date;

  @Prop({ required: true, type: Object, default: {}, name: 'meta_data' })
  metaData: object;

  @Prop({ required: true, trim: true, enum: TypeRequests })
  type: string;

  @Prop({ required: true, default: false })
  used: boolean;
}

export const RequestsSchema = SchemaFactory.createForClass(Requests);

RequestsSchema.index(
  { expiredAt: 1 },
  { expireAfterSeconds: 0, background: true, name: 'expired_at_index' },
);
