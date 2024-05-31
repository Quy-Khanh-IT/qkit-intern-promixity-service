import { Controller, Get, HttpCode, Param } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
  })
  async findOneById(@Param('id') id: string) {
    const result = await this.notificationService.findOneById(id);

    return result;
  }
}
