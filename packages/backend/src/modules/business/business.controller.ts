import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UploadFileConstraint } from 'src/common/constants';
import {
  BusinessStatusEnum,
  DeleteActionEnum,
  StatusActionsEnum,
} from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';

import { NoContentResponseDto } from '../user/dto/change-password.response.dto';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { Business } from './entities/business.entity';

@Controller('businesses')
@ApiTags('businesses')
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('nearby')
  @HttpCode(200)
  @ApiQuery({ name: 'longitude', required: true })
  @ApiQuery({ name: 'latitude', required: true })
  @ApiQuery({ name: 'maxDistance', required: true })
  @ApiResponse({
    status: 200,
    description: 'User successfully get business nearby.',
  })
  async getNearby(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
    @Query('maxDistance') maxDistance: string,
  ) {
    const result = await this.businessService.findNearBy(
      longitude,
      latitude,
      maxDistance,
    );

    return result;
  }

  @Get('status')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: BusinessStatusEnum, required: true })
  @ApiResponse({
    status: 200,
    description: 'User successfully modify status business',
  })
  async getBusinessesByStatus(@Query('type') type: BusinessStatusEnum) {
    const result = await this.businessService.getBusinessesByStatus(type);

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

  @Post('')
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
    if (type === DeleteActionEnum.SOFT) {
      const result: boolean = await this.businessService.softDelete(
        id,
        req.user.id,
      );

      return result;
    }

    if (type === DeleteActionEnum.HARD) {
      const result: boolean = await this.businessService.hardDelete(
        id,
        req.user.id,
      );

      return result;
    }

    return false;
  }

  @Patch(':id/information')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({ type: UpdateInformationDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully update business information.',
  })
  async updateInformation(
    @Param('id') id: string,
    @Body()
    updateInformationDto: UpdateInformationDto,
    @Req() req: Request,
  ) {
    const result: boolean = await this.businessService.updateInformation(
      id,
      req.user.id,
      updateInformationDto,
    );

    return result;
  }

  @Patch(':id/addresses')
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
    updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const result: Business = await this.businessService.updateAddresses(
      id,
      req.user.id,
      updateAddressDto,
    );

    return result;
  }

  @Patch(':id/images')
  @UseGuards(JwtAccessTokenGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 4, UploadFileConstraint.MULTER_OPTION),
  )
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully update business information.',
  })
  async updateImages(
    @UploadedFiles() images: Express.Multer.File[],
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<NoContentResponseDto> {
    const result = await this.businessService.updateImage(
      id,
      req.user.id,
      images,
    );

    return {
      isSuccess: result,
    };
  }

  @Patch(':id/restore')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully restore business.',
  })
  async restore(@Param('id') id: string) {
    const result: boolean = await this.businessService.restore(id);

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
    const result: boolean = await this.businessService.handleStatus(id, type);

    return result;
  }
}
