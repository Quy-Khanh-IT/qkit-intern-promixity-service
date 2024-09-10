import { PartialType } from '@nestjs/swagger';

import { UpdateAddressDto } from './update-address.dto';

export class ValidateAddressDto extends PartialType(UpdateAddressDto) {}
