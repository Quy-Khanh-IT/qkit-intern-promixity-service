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
import { transObjectIdToString } from 'src/common/utils';
import { DeleteActionEnum } from 'src/common/enums';

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
    const userId = transObjectIdToString(req.user._id);

    if (type === DeleteActionEnum.SOFT) {
      const result: Boolean = await this.businessService.softDelete(id);

      return result;
    }

    if (type === DeleteActionEnum.HARD) {
      const result: Boolean = await this.businessService.forceDelete(
        userId,
        id,
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
}
