import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { UserConstant } from 'src/common/constants';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'New password', example: 'NewPassword123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'password must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'New password', example: 'NewPassword123@' })
  confirmPassword: string;
}

//path: packages/backend/src/modules/auth/dto/sign-up.dto.ts
