import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { ApiProperty } from '@nestjs/swagger';

export type DistrictDocument = District & Document;

@Schema()
export class District extends BaseEntity {
  @ApiProperty({ description: 'Unique code for the district', example: 'D001' })
  @Prop({ required: true })
  code: string;

  @ApiProperty({ description: 'Name of the district', example: 'District 1' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'English name of the district',
    example: 'District 1',
  })
  @Prop()
  name_en: string;

  @ApiProperty({
    description: 'Full name of the district',
    example: 'District 1, City A',
  })
  @Prop({ required: true })
  full_name: string;

  @ApiProperty({
    description: 'English full name of the district',
    example: 'District 1, City A',
  })
  @Prop()
  full_name_en: string;

  @ApiProperty({ description: 'Code name of the district', example: 'D001' })
  @Prop()
  code_name: string;

  @ApiProperty({
    description: 'Code of the province that the district belongs to',
    example: 'P001',
  })
  @Prop({ required: true })
  province_code: string;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
