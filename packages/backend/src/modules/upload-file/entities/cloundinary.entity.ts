import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class CloundinaryImage {
  @Prop({ required: true, trim: true })
  publicId: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  secureUrl: string;

  @Prop({ required: true, trim: true })
  format: string;

  @Prop({ required: true, trim: true })
  width: number;

  @Prop({ required: true, trim: true })
  height: number;
}
