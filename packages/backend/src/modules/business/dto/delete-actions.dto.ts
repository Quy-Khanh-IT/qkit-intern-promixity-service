import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeleteActionEnum } from 'src/common/enums';

export class DeleteActionsDto {
  @ApiProperty({ enum: DeleteActionEnum })
  @IsIn([DeleteActionEnum.SOFT, DeleteActionEnum.HARD])
  action: DeleteActionEnum;
}
