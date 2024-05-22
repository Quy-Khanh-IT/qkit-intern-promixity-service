import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateAddressDto } from './update-address.dto';

export class ValidateAddressDto extends PartialType(UpdateAddressDto) {
  @IsString()
  @IsNotEmpty()
  country: string;
}
