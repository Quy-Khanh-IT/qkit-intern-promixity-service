import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DeleteType } from 'src/common/enums';

export class DeleteUserQueryDto {
  @IsEnum(DeleteType)
  @ApiProperty({ enum: DeleteType, example: DeleteType.SOFT_DELETE })
  deleteType: string = DeleteType.SOFT_DELETE;
}
