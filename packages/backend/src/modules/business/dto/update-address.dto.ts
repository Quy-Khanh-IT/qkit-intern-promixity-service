import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lý Tự Trọng' })
  addressLine: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '612/A Lý Tự Trọng' })
  addressLineFull: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  province: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Quận 1' })
  district: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      location: {
        coordinates: [106.698387, 10.775114],
      },
    },
  })
  location: {
    coordinates: number[];
  };
}
