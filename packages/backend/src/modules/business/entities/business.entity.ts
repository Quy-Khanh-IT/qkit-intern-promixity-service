import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import * as MongooseDelete from 'mongoose-delete';
import { HydratedDocument, Schema as OriginalSchema } from 'mongoose';
import { BusinessStatusEnum, StarEnum } from 'src/common/enums';

export type BusinessDocument =
  HydratedDocument<MongooseDelete.SoftDeleteDocument>;

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

export class Star {
  @Prop({ enum: StarEnum })
  star: string;

  @Prop({})
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

const defaultStars = [
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
] as Array<Star>;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
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

  @Prop({ default: defaultStars })
  stars: Star[];

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true })
  addressLine: string;

  @Prop([DayOpenCloseTimeSchema])
  dayOfWeek: DayOpenCloseTime[];

  @Prop({ trim: true })
  longitude: string;

  @Prop({ trim: true })
  latitude: string;

  @Prop({ enum: BusinessStatusEnum, default: BusinessStatusEnum.PENDING })
  status: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: null })
  deletedAt: OriginalSchema.Types.Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

// BusinessSchema.plugin(MongooseDelete, {
//   deletedAt: true,
//   overrideMethods: 'all',
// });
