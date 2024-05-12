import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { ApiProperty } from '@nestjs/swagger';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province extends BaseEntity {
  @ApiProperty({ description: 'Unique code for the province', example: 'P001' })
  @Prop({ required: true })
  code: string;

  @ApiProperty({ description: 'Name of the province', example: 'Province A' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'English name of the province',
    example: 'Province A',
  })
  @Prop()
  name_en: string;

  @ApiProperty({
    description: 'Full name of the province',
    example: 'Province A, Country X',
  })
  @Prop({ required: true })
  full_name: string;

  @ApiProperty({
    description: 'English full name of the province',
    example: 'Province A, Country X',
  })
  @Prop()
  full_name_en: string;

  @ApiProperty({ description: 'Code name of the province', example: 'P001' })
  @Prop()
  code_name: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
