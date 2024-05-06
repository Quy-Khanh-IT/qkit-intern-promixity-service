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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseFloat } from '../../cores/decorators/parseFloat.decorator';
import { Request } from 'express';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { transObjectIdToString } from 'src/common/utils';

@Controller('businesses')
@ApiTags('businesses')
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('/getAllByCurrentUser')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully get business.',
  })
  async getAllByCurrentUser(@Req() req: Request) {
    const result = await this.businessService.getAllByCurrentUser(req.user);

    return result;
  }

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
    const userId = transObjectIdToString(req.user._id);

    const result: Business = await this.businessService.create(
      createBusinessDto,
      userId,
    );

    return result;
  }

  @Delete(':id/softDelete')
  @UseGuards(JwtAccessTokenGuard)
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
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully delete business and can not store.',
  })
  async forceDelete(@Param('id') id: string, @Req() req: Request) {
    const userId = transObjectIdToString(req.user._id);

    const result: Boolean = await this.businessService.forceDelete(userId, id);

    return result;
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
}
