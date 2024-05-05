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
}
