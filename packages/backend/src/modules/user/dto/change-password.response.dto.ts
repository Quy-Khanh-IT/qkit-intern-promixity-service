import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({ example: 'true' })
  isSuccess: boolean;
}
