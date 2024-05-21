import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class StructureDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Việt Nam', default: 'Việt Nam' })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hồ Chí Minh' })
  province: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Quận 1' })
  district: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '600 Lý Tự Trọng' })
  addressLine: string;
}
