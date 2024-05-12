import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { ApiProperty } from '@nestjs/swagger';

export type WardDocument = Ward & Document;

@Schema()
export class Ward extends BaseEntity {
  @ApiProperty({ description: 'Unique code for the ward', example: 'W001' })
  @Prop({ required: true })
  code: string;

  @ApiProperty({ description: 'Name of the ward', example: 'Ward 1' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'English name of the ward', example: 'Ward 1' })
  @Prop()
  name_en: string;

  @ApiProperty({
    description: 'Full name of the ward',
    example: 'Ward 1, District X',
  })
  @Prop({ required: true })
  full_name: string;

  @ApiProperty({
    description: 'English full name of the ward',
    example: 'Ward 1, District X',
  })
  @Prop()
  full_name_en: string;

  @ApiProperty({ description: 'Code name of the ward', example: 'W001' })
  @Prop()
  code_name: string;

  @ApiProperty({
    description: 'Code of the district that the ward belongs to',
    example: 'D001',
  })
  @Prop({ required: true })
  district_code: string;
}

export const WardSchema = SchemaFactory.createForClass(Ward);
