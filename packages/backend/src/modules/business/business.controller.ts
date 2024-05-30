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
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { UploadFileConstraint } from 'src/common/constants';
import { Roles } from 'src/common/decorators/role.decorator';
import {
  DeleteActionEnum,
  StatusActionsEnum,
  UserRole,
} from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';

import { NoContentResponseDto } from '../user/dto/change-password.response.dto';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { FindAllBusinessQuery } from './dto/find-all-business-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { Business } from './entities/business.entity';

@Controller('businesses')
@ApiTags('businesses')
@ApiBearerAuth()
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  async findAllBusinesses(@Query() data: FindAllBusinessQuery) {
    const transferData = plainToClass(FindAllBusinessQuery, data);

    return await this.businessService.findAll(transferData);
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
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
        req.user,
      );

      return result;
    }

    if (type === DeleteActionEnum.HARD) {
      const result: boolean = await this.businessService.hardDelete(
        id,
        req.user,
      );

      return result;
    }

    return false;
  }

  @Patch(':id/information')
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
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
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
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
