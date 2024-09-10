import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Category extends BaseEntity {
  @Prop({ required: true, trim: true, maxlength: 25 })
  name: string;

  @Prop({ required: true, trim: true, maxlength: 255 })
  description: string;

  @Prop({ required: true, trim: true })
  linkURL: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = HydratedDocument<Category>;
