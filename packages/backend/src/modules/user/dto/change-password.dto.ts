import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { UserConstant } from 'src/common/constants';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'oldPassword123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'oldPassword must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  oldPassword: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'newPassword must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  newPassword: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword123@' })
  @Matches(UserConstant.regexPassword, {
    message:
      'confirmPassword must be 6-25 characters long, include at least one uppercase letter, one number, and one special character.',
  })
  confirmPassword: string;
}
