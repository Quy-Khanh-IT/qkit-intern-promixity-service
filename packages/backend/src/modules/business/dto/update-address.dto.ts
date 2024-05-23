import { PickType } from '@nestjs/swagger';

import { CreateBusinessDto } from './create-business.dto';

export class UpdateAddressDto extends PickType(CreateBusinessDto, [
  'addressLine',
  'fullAddress',
  'province',
  'district',
  'country',
  'location',
]) {}
