import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateGeneralInfoDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '0389185482',
  })
  @IsPhoneNumber('VN')
  phoneNumber: string;
}
