import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceService } from './service.service';

@Controller('services')
@ApiTags('services')
@ApiBearerAuth()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }
}
