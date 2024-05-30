import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class ServiceSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  order: number;
}
