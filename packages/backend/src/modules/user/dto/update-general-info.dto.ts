import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateGeneralInfoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'John' })
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiPropertyOptional({ example: 'Doe' })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '0987654321' })
  @IsPhoneNumber('VN')
  phoneNumber: string;
}
