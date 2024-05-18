import { Prop, Schema } from '@nestjs/mongoose';
import { DayEnum } from 'src/common/enums';

@Schema({
  _id: false,
})
export class DayOpenCloseTimeSchema {
  @Prop({ required: true, enum: DayEnum })
  day: string;

  @Prop({ required: true, trim: true })
  openTime: string;

  @Prop({ required: true, trim: true })
  closeTime: string;
}
