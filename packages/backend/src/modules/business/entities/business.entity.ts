import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import * as MongooseDelete from 'mongoose-delete';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BusinessStatusEnum, StarEnum } from 'src/common/enums';
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
] as Array<Star>;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: true,
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

  @Prop([CloundinaryImage])
  images: CloundinaryImage[];

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: 0 })
  overallRating: number;

  @Prop({ default: 0 })
  totalReview: number;

  @Prop({ type: [StarSchema], default: defaultStars })
  stars: StarSchema[];

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true })
  addressLine: string;

  @Prop([DayOpenCloseTimeSchema])
  dayOfWeek: DayOpenCloseTimeSchema[];

  @Prop({ trim: true })
  longitude: string;

  @Prop({ trim: true })
  latitude: string;

  @Prop({
    enum: BusinessStatusEnum,
    default: BusinessStatusEnum.PENDING,
  })
  status: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: null })
  deletedAt: MongooseSchema.Types.Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

// BusinessSchema.plugin(MongooseDelete, {
//   deletedAt: true,
//   overrideMethods: 'all',
// });
