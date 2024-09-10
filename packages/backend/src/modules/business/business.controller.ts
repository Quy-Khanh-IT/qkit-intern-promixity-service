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
  ApiOperation,
  ApiQuery,
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
import { FindAllUserBusinessQuery } from '../user/dto/find-all-user-business.query.dto';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { FindAllBusinessQuery } from './dto/find-all-business-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { Business } from './entities/business.entity';

@Controller('businesses')
@ApiTags('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN]: get all businesses with query filter' })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  async findAllBusinesses(@Query() data: FindAllBusinessQuery) {
    const transferData = plainToClass(FindAllBusinessQuery, data);

    return await this.businessService.findAll(transferData);
  }

  @Get('/users')
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.BUSINESS)
  @HttpCode(200)
  @ApiOperation({ summary: '[BUSINESS]: get all user businesses' })
  async getAllBusiness(
    @Query() data: FindAllUserBusinessQuery,
    @Req() req: Request,
  ) {
    const transferData = plainToClass(FindAllUserBusinessQuery, data);
    const result = await this.businessService.getUserBusinesses(
      req.user.id,
      transferData,
    );
    return result;
  }

  // @Get(':id/reviews')
  // @ApiOperation({ summary: '[ALL]: get all reviews of business' })
  // @HttpCode(200)
  // async getReviewsByBusiness(@Param('id') id: string) {
  //   return this.businessService.getReviews(id);
  // }

  @Get('status')
  @HttpCode(200)
  getStatus() {
    return this.businessService.getStatus();
  }

  @Get('actions')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN]: get actions' })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  getActions() {
    return this.businessService.getActions();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: '[ALL]: get detail business by id' })
  async getById(@Param('id') id: string) {
    const result: Business = await this.businessService.findOneById(id);

    return result;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN, USER, BUSINESS]: create new business' })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @HttpCode(201)
  @ApiBody({
    type: CreateBusinessDto,
  })
  async create(
    @Body()
    createBusinessDto: CreateBusinessDto,
    @Req() req: Request,
  ) {
    const result: Business = await this.businessService.create(
      createBusinessDto,
      req.user,
    );

    return result;
  }

  @Post(':id/restore-request')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[BUSINESS]: restore business which was soft deleted(closed status)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @HttpCode(200)
  async restoreRequest(@Param('id') id: string) {
    const result: boolean = await this.businessService.restoreRequest(id);

    return result;
  }

  @Post(':id/close-request')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[BUSINESS]: if business is approved, "BUSINESS" must be request to delete(close business)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiQuery({ name: 'type', enum: DeleteActionEnum, required: true })
  async requestDelete(@Param('id') id: string, @Req() req: Request) {
    await this.businessService.requestDelete(id, req.user);

    return true;
  }

  @Patch(':id/information')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, BUSINESS]: update business information (name, description, phoneNumber,...)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @HttpCode(200)
  @ApiBody({ type: UpdateInformationDto })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, BUSINESS]: update business address(province, district, address)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @HttpCode(200)
  @ApiBody({ type: UpdateAddressDto })
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
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[ADMIN, BUSINESS]: update business images (maximum 4)',
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[ADMIN]: restore business which was soft deleted(closed status)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  async restore(@Param('id') id: string, @Req() req: Request) {
    const result: boolean = await this.businessService.restore(id, req.user);

    return result;
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[ADMIN]: update business status',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: StatusActionsEnum, required: true })
  async handleStatus(
    @Param('id') id: string,
    @Query('type') type: StatusActionsEnum,
  ) {
    const result: boolean = await this.businessService.handleStatus(id, type);

    return result;
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, BUSINESS]: "ADMIN" can delete immediately, "BUSINESS" can delete while their business is "pending"',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiQuery({ name: 'type', enum: DeleteActionEnum, required: true })
  async delete(
    @Param('id') id: string,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    if (type === DeleteActionEnum.SOFT) {
      const result = await this.businessService.softDelete(id, req.user);

      return result;
    }

    if (type === DeleteActionEnum.HARD) {
      const result = await this.businessService.hardDelete(id, req.user);

      return result;
    }

    return false;
  }
}
