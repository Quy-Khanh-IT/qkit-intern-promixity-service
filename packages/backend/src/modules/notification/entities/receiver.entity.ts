import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class ReceiverSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;
}
