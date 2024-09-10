import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { BusinessStatusEnum, StarEnum } from 'src/common/enums';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

import { CategorySchema } from './category.entity';
import { DayOpenCloseTimeSchema } from './dayOpenCloseTime.entity';
import { Image } from './image.entity';
import { ServiceSchema } from './service.entity';
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
  phoneNumber: string;

  @Prop({ default: '', trim: true })
  website: string;

  @Prop({ type: [Image], default: [] })
  images: Image[];

  @Prop({ type: CategorySchema, required: true })
  @Type(() => CategorySchema)
  category: CategorySchema;

  @Prop({ type: [ServiceSchema] })
  @Type(() => ServiceSchema)
  services: ServiceSchema[];

  @Prop({ default: 0 })
  overallRating: number;

  @Prop({ default: 0 })
  totalReview: number;

  @Prop({ type: [StarSchema], default: defaultStars })
  stars: StarSchema[];

  @Prop({ trim: true })
  addressLine: string;

  @Prop({ trim: true })
  fullAddress: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  district: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop([DayOpenCloseTimeSchema])
  dayOfWeek: DayOpenCloseTimeSchema[];

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
  status: BusinessStatusEnum;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Exclude()
  userId: Types.ObjectId;

  @Transform((value) => value.obj?.userId?.toString(), { toClassOnly: true })
  @Expose()
  user_id?: string;

  @Prop({ default: 0 })
  _page: number;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

BusinessSchema.index({ location: '2dsphere' });
BusinessSchema.index({ name: 'text', description: 'text' });
BusinessSchema.index({ userId: 1 });

export type BusinessDocument = HydratedDocument<Business>;
