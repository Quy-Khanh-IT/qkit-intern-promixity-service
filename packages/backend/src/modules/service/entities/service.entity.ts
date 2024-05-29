import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Service extends BaseEntity {
  @Prop({ required: true, trim: true, unique: true, maxlength: 50 })
  name: string;

  @Prop({ trim: true, maxlength: 255 })
  description: string;

  @Prop()
  order: number;
}
export const ServiceSchema = SchemaFactory.createForClass(Service);
export type ServiceDocument = HydratedDocument<Service>;
