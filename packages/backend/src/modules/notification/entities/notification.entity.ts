import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  NotificationResourceEnum,
  NotificationTypeEnum,
} from 'src/common/enums/notification.enum';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Notification extends BaseEntity {
  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  content: string;

  @Prop({
    enum: NotificationTypeEnum,
    required: true,
  })
  type: NotificationTypeEnum;

  @Prop({ enum: NotificationResourceEnum, required: true })
  resource: NotificationResourceEnum;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = HydratedDocument<Notification>;

NotificationSchema.index({ receiverId: 1 });
NotificationSchema.index({ isRead: 1 });
