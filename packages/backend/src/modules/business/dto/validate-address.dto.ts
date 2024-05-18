import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOpenCloseTimeSchema } from '../entities/dayOpenCloseTime.entity';
import { UpdateAddressDto } from './update-address.dto';

export class ValidateAddress extends PartialType(UpdateAddressDto) {
  @IsString()
  @IsNotEmpty()
  country: string;
}
