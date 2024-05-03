import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'New password', example: 'NewPassword123@' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'New password', example: 'NewPassword123@' })
  oldPassword: string;
}

//path: packages/backend/src/modules/auth/dto/sign-up.dto.ts
