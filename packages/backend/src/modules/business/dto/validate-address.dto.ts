import { PartialType } from '@nestjs/swagger';

import { UpdateAddressDto } from './update-address.dto';

export class ValidateAddressDto extends PartialType(UpdateAddressDto) {
  // @IsString()
  // @IsNotEmpty()
  // country: string;
  // @IsNotEmpty()
  // location: {
  //   coordinates: number[];
  // };
}
