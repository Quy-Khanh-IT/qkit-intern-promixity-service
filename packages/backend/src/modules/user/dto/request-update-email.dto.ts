import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequesUpdateEmail {
  @IsNotEmpty()
  @ApiProperty({
    description: 'your current password',
    example: 'Password123@',
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email',
    example: 'example123@gmail.com',
  })
  email: string;
}
