import { PickType } from '@nestjs/swagger';

import { CreateBusinessDto } from './create-business.dto';

export class UpdateAddressDto extends PickType(CreateBusinessDto, [
  'address_line',
  'full_address',
  'province',
  'district',
  'country',
  'location',
] as const) {
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Lý Tự Trọng' })
  // address_line: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: '612/A Lý Tự Trọng' })
  // full_address: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Hồ Chí Minh' })
  // province: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Quận 1' })
  // district: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ example: 'Việt Nam' })
  // country: string;
  // @IsNotEmpty()
  // @ApiProperty({
  //   example: {
  //     coordinates: [106.698387, 10.775114],
  //   },
  // })
  // location: {
  //   coordinates: number[];
  // };
}
