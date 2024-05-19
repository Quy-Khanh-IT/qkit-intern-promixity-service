import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { ParseFloat } from '../../cores/decorators/parseFloat.decorator';
import { Request } from 'express';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';

import {
  DeleteActionEnum,
  GetBusinessesByStatusEnum,
  StatusActionsEnum,
} from 'src/common/enums';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('businesses')
@ApiTags('businesses')
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully get business.',
  })
  async getById(@Param('id') id: string) {
    const result: Business = await this.businessService.getById(id);

    return result;
  }

  @Get('status')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: GetBusinessesByStatusEnum, required: true })
  @ApiResponse({
    status: 200,
    description: 'User successfully modify status business',
  })
  async getBusinessesByStatus(@Query('type') type: GetBusinessesByStatusEnum) {
    const result = await this.businessService.getBusinessesByStatus(type);

    return result;
  }

  @Post('create')
  @UseGuards(JwtAccessTokenGuard)
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
    @Req() req: Request,
  ) {
    const result: Business = await this.businessService.create(
      createBusinessDto,
      req.user.id,
    );

    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({ type: UpdateBusinessDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully update business information.',
  })
  async updateInformation(
    @Param('id') id: string,
    @Body()
    @ParseFloat(['longitude', 'latitude'])
    updateBusinessDto: UpdateBusinessDto,
    @Req() req: Request,
  ) {
    const result: Boolean = await this.businessService.updateInformation(
      id,
      req.user.businesses,
      updateBusinessDto,
    );

    return result;
  }

  @Patch('addresses/:id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully update business information.',
  })
  async updateAddresses(
    @Param('id') id: string,
    @Body()
    @ParseFloat(['longitude', 'latitude'])
    updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const result: Business = await this.businessService.updateAddresses(
      id,
      req.user.businesses,
      updateAddressDto,
    );

    return result;
  }

  @Patch('images/:id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully update business information.',
  })
  async updateImages(
    @Param('id') id: string,
    @Body()
    @ParseFloat(['longitude', 'latitude'])
    updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const result: Business = await this.businessService.updateAddresses(
      id,
      req.user.businesses,
      updateAddressDto,
    );

    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: DeleteActionEnum, required: true })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted business.',
  })
  async delete(
    @Param('id') id: string,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    if (type === DeleteActionEnum.SOFT) {
      const result: Boolean = await this.businessService.softDelete(
        id,
        req.user,
      );

      return result;
    }

    if (type === DeleteActionEnum.HARD) {
      const result: Boolean = await this.businessService.forceDelete(
        id,
        req.user,
      );

      return result;
    }

    return false;
  }

  @Patch(':id/restore')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully restore business.',
  })
  async restore(@Param('id') id: string) {
    const result: Boolean = await this.businessService.restore(id);

    return result;
  }

  // ADMIN
  @Patch(':id/status')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: StatusActionsEnum, required: true })
  @ApiResponse({
    status: 200,
    description: 'User successfully modify status business',
  })
  async handleStatus(
    @Param('id') id: string,
    @Query('type') type: StatusActionsEnum,
  ) {
    const result: Boolean = await this.businessService.handleStatus(id, type);

    return result;
  }
}
