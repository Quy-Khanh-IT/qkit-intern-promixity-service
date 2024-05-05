import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseFloat } from '../../cores/decorators/parseFloat.decorator';

@Controller('businesses')
@ApiTags('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('create')
  @HttpCode(201)
  @ApiBody({
    type: CreateBusinessDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully create business.',
  })
  async create(
    @Body()
    @ParseFloat(['longitude', 'latitude'])
    createBusinessDto: CreateBusinessDto,
  ) {
    const result: Business =
      await this.businessService.create(createBusinessDto);

    return result;
  }

  @Delete(':id/softDelete')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully delete business.',
  })
  async softDelete(@Param('id') id: string) {
    const result: Boolean = await this.businessService.softDelete(id);

    return result;
  }

  @Delete(':id/forceDelete')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully delete business and can not store.',
  })
  async forceDelete(@Param('id') id: string) {
    const result: Boolean = await this.businessService.forceDelete(id);

    return result;
  }

  @Patch(':id/restore')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully restore business.',
  })
  async restore(@Param('id') id: string) {
    const result: Boolean = await this.businessService.restore(id);

    return result;
  }
}
