import { Prop, Schema } from '@nestjs/mongoose';

@Schema({})
export class CategorySchema {
  @Prop()
  name: string;

  @Prop()
  order: number;
}
