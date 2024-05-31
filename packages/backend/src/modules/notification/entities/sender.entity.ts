import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

@Schema({
  _id: false,
})
export class SenderSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;
}
