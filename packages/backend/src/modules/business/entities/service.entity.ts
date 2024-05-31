import { Prop, Schema } from '@nestjs/mongoose';

@Schema({})
export class ServiceSchema {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  order: number;
}
