import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  _id: false,
})
export class ReceiverSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;
}
