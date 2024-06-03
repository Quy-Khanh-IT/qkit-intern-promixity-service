import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { DeleteActionEnum, UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { StarSerializeInterceptor } from 'src/cores/interceptors/star.interceptor';

import { CreateReviewDto } from './dto/create-review.dto';
import { EditResponseDto } from './dto/edit-response.dto';
import { EditReviewDto } from './dto/edit-review.dto';
import { FindAllReviewQuery } from './dto/find-all-review-query.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('reviews')
@ApiTags('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN]: create a review which can react with combination of star and comment',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async findAllReview(@Query() data: FindAllReviewQuery) {
    const transferData = plainToClass(FindAllReviewQuery, data);

    return await this.reviewService.findAll(transferData);
  }

  @Get(':previewId')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '[ADMIN]: filter reviews',
  })
  async findById(@Param('previewId') id: string) {
    const review: Review = await this.reviewService.findById(id);

    return review;
  }

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: create a review which can react with combination of star and comment',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @UseInterceptors(StarSerializeInterceptor)
  @ApiBody({
    type: CreateReviewDto,
  })
  createPreview(
    @Body(new ValidationPipe({ transform: true }))
    createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.createPreview(createReviewDto, req.user);
  }

  @Post(':id/responses')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: create a reply which can comment/reply only (id can be reviewId/responseId)',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiBody({
    type: ReplyReviewDto,
  })
  CreateReply(
    @Param('id') id: string,
    @Body() replyReviewDto: ReplyReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.createResponse(replyReviewDto, id, req.user.id);
  }

  @Put(':reviewId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: edit a preview that was previously created',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiBody({
    type: EditReviewDto,
  })
  editPreview(
    @Param('reviewId') id: string,
    @Body() editReviewDto: EditReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.editReview(id, editReviewDto, req.user.id);
  }

  @Put(':responseId/responses')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: create a review which can react with combination of star and comment',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiBody({
    type: EditResponseDto,
  })
  async editResponse(
    @Param('responseId') id: string,
    @Body() editResponseDto: EditResponseDto,
    @Req() req: Request,
  ) {
    return this.reviewService.editResponse(id, editResponseDto, req.user.id);
  }

  @Delete(':reviewId')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: USER, BUSINESS can delete their own review, ADMIN can delete any review.',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiQuery({ name: 'type', enum: DeleteActionEnum, required: true })
  async delete(
    @Param('reviewId') id: string,
    @Query('type') type: DeleteActionEnum,
    @Req() req: Request,
  ) {
    if (type === DeleteActionEnum.SOFT) {
      return this.reviewService.softDelete(id, req.user);
    }

    if (type === DeleteActionEnum.HARD) {
      return this.reviewService.hardDelete(id, req.user);
    }
  }

  @Patch(':id/restore')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '[ADMIN]: Restore a preview that was previously deleted',
  })
  async restore(@Param('id') id: string, @Req() req: Request) {
    return this.reviewService.restoreReview(id);
  }

  @Delete(':responseId/responses')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: '[ADMIN, USER, BUSINESS]: delete a response',
  })
  async deleteResponses(@Param('responseId') id: string, @Req() req: Request) {
    return this.reviewService.deleteResponses(id, req.user.id);
  }
}
