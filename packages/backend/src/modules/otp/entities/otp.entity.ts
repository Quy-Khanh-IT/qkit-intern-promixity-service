import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class OTP extends BaseEntity {
  @Prop({ required: true, trim: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, length: 6 })
  otp: string;

  @Prop({
    required: true,
    name: 'expired_at',
  })
  expiredAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.index(
  { expiredAt: 1 },
  { expireAfterSeconds: 0, background: true, name: 'expired_at_index' },
);
