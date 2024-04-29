import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'example123@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: 'Password123@' })
  password: string;
}
