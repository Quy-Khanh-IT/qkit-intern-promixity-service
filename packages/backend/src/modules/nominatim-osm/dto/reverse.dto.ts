import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ReverseDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiProperty({ example: '106.698387' })
  longitude: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiProperty({ example: '10.775114' })
  latitude: string;
}
