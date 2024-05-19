import { Prop, Schema } from '@nestjs/mongoose';
import { StarEnum } from 'src/common/enums';

@Schema({
  _id: false,
})
export class StarSchema {
  @Prop({ required: true, enum: StarEnum })
  star: StarEnum;

  @Prop({})
  count: number;
}
