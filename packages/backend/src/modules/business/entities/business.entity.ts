import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BusinessStatusEnum, StarEnum } from 'src/common/enums';
import { number } from '@hapi/joi';

@Schema({
  _id: false,
})
export class DayOpenCloseTime {
  @Prop({ required: true, trim: true })
  day: string;

  @Prop({ required: true, trim: true })
  openTime: string;

  @Prop({ required: true, trim: true })
  closeTime: string;
}

export interface Star {
  star: StarEnum;
  count: number;
}

@Schema({
  _id: false,
})
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

const DayOpenCloseTimeSchema = SchemaFactory.createForClass(DayOpenCloseTime);
const CloundinaryImageSchema = SchemaFactory.createForClass(CloundinaryImage);

const defaultStars: Star[] = [
  {
    star: StarEnum.ONE,
    count: 0,
  },
  {
    star: StarEnum.TWO,
    count: 0,
  },
  {
    star: StarEnum.THREE,
    count: 0,
  },
  {
    star: StarEnum.FOUR,
    count: 0,
  },
  {
    star: StarEnum.FIVE,
    count: 0,
  },
];

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Business extends BaseEntity {
  @Prop({ required: true, unique: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ default: '', trim: true, maxlength: 500 })
  description: string;

  @Prop({ default: '', trim: true })
  phoneNumber: string;

  @Prop({ default: '', trim: true })
  website: string;

  @Prop([CloundinaryImageSchema])
  images: CloundinaryImage[];

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ default: null })
  services: string;

  @Prop({ default: 0 })
  overallRating: number;

  @Prop({ default: 0 })
  totalReview: number;

  @Prop({ type: [Object], default: defaultStars })
  stars: Star[];

  @Prop({ trim: true })
  addressLine: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  country: string;

  @Prop([DayOpenCloseTimeSchema])
  dayOfWeek: DayOpenCloseTime[];

  @Prop({ trim: true })
  longitude: string;

  @Prop({ trim: true })
  latitude: string;

  @Prop({ enum: BusinessStatusEnum, default: BusinessStatusEnum.PENDING })
  status: string;

  @Prop({ default: null })
  deleted_at: MongooseSchema.Types.Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
export type BusinessDocument = HydratedDocument<Business>;
