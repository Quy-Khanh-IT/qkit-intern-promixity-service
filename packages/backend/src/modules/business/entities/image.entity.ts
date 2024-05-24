import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class Image {
  @Prop({ required: true })
  public_id: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  etag: string;

  @Prop({ required: true, trim: true })
  phash: string;
}
