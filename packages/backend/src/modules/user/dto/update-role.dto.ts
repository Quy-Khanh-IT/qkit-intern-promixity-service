import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/common/enums';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;
}
