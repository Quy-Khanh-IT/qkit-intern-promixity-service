import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBusinessStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'active' })
  status: string;
}
