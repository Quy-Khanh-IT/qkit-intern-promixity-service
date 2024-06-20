import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/role.decorator';
import { DeleteActionEnum, EmotionEnum, UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { StarSerializeInterceptor } from 'src/cores/interceptors/star.interceptor';

import { CommentFilter } from './dto/comment-filter.dto';
import { CommentQuery } from './dto/comment-query.dto';
import { CommentDto } from './dto/create-comment.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllBusinessReviewQuery } from './dto/find-all-business-review-query.dto';
import { FindAllReviewQuery } from './dto/find-all-review-query.dto';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN]: manage reviews, filter reviews by businessId, userId, star',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  async findAllReview(@Query() data: FindAllReviewQuery) {
    const transferData = plainToClass(FindAllReviewQuery, data);

    return await this.reviewService.findAll(transferData);
  }

  @Patch(':reviewId/report')
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.USER, UserRole.BUSINESS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[USER, BUSINESS, ADMIN]: report a review',
  })
  async reportReview(@Param('reviewId') id: string, @Req() req: Request) {
    return await this.reviewService.reportReview(id, req.user);
  }

  // @Get(':reviewId/comments')
  // @HttpCode(200)
  // @ApiOperation({
  //   summary: '[ALL]: get comments of a review',
  // })
  // async getCommentsByReview(
  //   @Param('reviewId') id: string,
  //   @Query() query: CommentFilter,
  // ) {
  //   const transferData = plainToClass(CommentFilter, query);

  //   const comments = await this.reviewService.getCommentsByReview(
  //     id,
  //     transferData,
  //   );

  //   return comments;
  // }

  // @Get('comments')
  // @HttpCode(200)
  // @ApiOperation({
  //   summary: '[ALL]',
  // })
  // async getComments(@Query() query: CommentQuery) {
  //   const comments = await this.reviewService.getComments(query);

  //   return comments;
  // }

  @Get(':businessId/filter')
  @HttpCode(200)
  @ApiOperation({
    summary: '[ALL]: get reviews of business',
  })
  async findReviewBusiness(
    @Param('businessId') id: string,
    @Query() data: FindAllBusinessReviewQuery,
  ) {
    const transferData = plainToClass(FindAllBusinessReviewQuery, data);

    return await this.reviewService.findReviewBusiness(id, transferData);
  }

  @Get('emotions')
  @HttpCode(200)
  @ApiOperation({
    summary: '[ALL]: get all emotions',
  })
  async getEmotions() {
    return EmotionEnum;
  }

  @Get(':reviewId')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @ApiQuery({ type: CommentFilter })
  @ApiOperation({
    summary:
      '[ADMIN]: Get details of a review by id (include business information)',
  })
  async findById(@Param('reviewId') id: string, @Query() query: CommentFilter) {
    const review: Review = await this.reviewService.findById(id, query);

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
  createReview(
    @Body(new ValidationPipe({ transform: true }))
    createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.createReview(createReviewDto, req.user);
  }

  @Post(':reviewId/comment')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: create a comment which can comment/reply on specific review',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiBody({
    type: CommentDto,
  })
  CreateComment(
    @Param('reviewId') id: string,
    @Body() commentDto: CommentDto,
    @Req() req: Request,
  ) {
    return this.reviewService.createComment(commentDto, id, req.user);
  }

  @Post(':commentId/response')
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[ADMIN, USER, BUSINESS]: reply a comment which can comment on specific review',
  })
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiBody({
    type: CommentDto,
  })
  create(
    @Param('commentId') id: string,
    @Body() commentDto: CommentDto,
    @Req() req: Request,
  ) {
    return this.reviewService.createReply(id, commentDto, req.user);
  }

  // @Put(':reviewId')
  // @HttpCode(200)
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary:
  //     '[ADMIN, USER, BUSINESS]: edit a preview that was previously created',
  // })
  // @UseGuards(JwtAccessTokenGuard, RoleGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  // @ApiBody({
  //   type: EditReviewDto,
  // })
  // editPreview(
  //   @Param('reviewId') id: string,
  //   @Body() editReviewDto: EditReviewDto,
  //   @Req() req: Request,
  // ) {
  //   return this.reviewService.editReview(id, editReviewDto, req.user.id);
  // }

  // @Put(':commentId')
  // @HttpCode(200)
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary:
  //     '[ADMIN, USER, BUSINESS]: create a review which can react with combination of star and comment',
  // })
  // @UseGuards(JwtAccessTokenGuard, RoleGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  // @ApiBody({
  //   type: EditResponseDto,
  // })
  // async editComment(
  //   @Param('commentId') id: string,
  //   @Body() editResponseDto: EditResponseDto,
  //   @Req() req: Request,
  // ) {
  //   return this.reviewService.editComment(id, editResponseDto, req.user.id);
  // }

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
      return false;
      // return this.reviewService.hardDelete(id, req.user);
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

  @Delete(':commentId/comments')
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.BUSINESS)
  @ApiOperation({
    summary: '[ADMIN, USER, BUSINESS]: delete a comment which belongs to owner',
  })
  async deleteComment(@Param('commentId') id: string, @Req() req: Request) {
    return this.reviewService.deleteComment(id, req.user.id);
  }
}
