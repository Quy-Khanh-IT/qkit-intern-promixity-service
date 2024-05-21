import { ApiProperty } from '@nestjs/swagger';

export class NoContentResponseDto {
  @ApiProperty({ example: 'true' })
  isSuccess: boolean;
}
