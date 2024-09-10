import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from 'src/common/enums';

export class GetUserProfileForAdminDto {
  @IsNotEmpty()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ description: '`Only for admin`', enum: UserStatus })
  userStatus: UserStatus = UserStatus.ACTIVE;
}
