import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { BusinessStatusEnum, StarEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

import { CloundinaryImage } from '../../upload-file/entities/cloundinary.entity';
import { DayOpenCloseTimeSchema } from './dayOpenCloseTime.entity';
import { StarSchema } from './star.entity';

const defaultStars: StarSchema[] = [
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
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ default: '', trim: true, maxlength: 500 })
  description: string;

  @Prop({ default: '', trim: true })
  phone_number: string;

  @Prop({ default: '', trim: true })
  website: string;

  @Prop([CloundinaryImage])
  images: CloundinaryImage[];

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: 0 })
  overall_rating: number;

  @Prop({ default: 0 })
  total_review: number;

  @Prop({ type: [StarSchema], default: defaultStars })
  stars: StarSchema[];

  @Prop({ trim: true })
  address_line: string;

  @Prop({ trim: true })
  full_address: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  country: string;

  @Prop([DayOpenCloseTimeSchema])
  day_of_week: DayOpenCloseTimeSchema[];

  @Prop({ type: [CloundinaryImage], default: [] })
  imgs: CloundinaryImage[];

  @Prop({
    type: {
      type: String,
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    coordinates: number[];
  };

  @Prop({
    enum: BusinessStatusEnum,
    default: BusinessStatusEnum.PENDING,
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ default: null })
  deleted_at: MongooseSchema.Types.Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

BusinessSchema.index({ location: '2dsphere' });

export type BusinessDocument = HydratedDocument<Business>;
