import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';

import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceService } from './service.service';

@Controller('services')
@ApiTags('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @HttpCode(200)
  async getAll() {
    return this.serviceService.getAll();
  }

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }
}
