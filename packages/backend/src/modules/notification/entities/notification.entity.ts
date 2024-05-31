import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  NotificationTypeEnum,
  ResourceEnum,
} from 'src/common/enums/notification.enum';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { SenderSchema } from './sender.entity';
import { ReceiverSchema } from './receiver.entity';
// import { Option } from './option.entity';

@Schema({
  timestamps: {
    createdAt: 'created_at',
  },
})
export class Notification extends BaseEntity {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({
    enum: NotificationTypeEnum,
  })
  type: NotificationTypeEnum;

  @Prop({ type: Object })
  sendBy: {
    id: string;
    name: string;
  };

  @Prop({ type: Object })
  receiveBy: {
    id: string;
    name: string;
  };

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = HydratedDocument<Notification>;

NotificationSchema.index({ receiverId: 1 });
