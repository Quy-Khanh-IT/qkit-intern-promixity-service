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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { DeleteActionEnum } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { StarSerializeInterceptor } from 'src/cores/interceptors/star.interceptor';

import { CreateReviewDto } from './dto/create-review.dto';
import { EditResponseDto } from './dto/edit-response.dto';
import { EditReviewDto } from './dto/edit-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('reviews')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
  })
  async findById(@Param('id') id: string) {
    const review: Review = await this.reviewService.findById(id);

    return review;
  }

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(StarSerializeInterceptor)
  @HttpCode(201)
  @ApiBody({
    type: CreateReviewDto,
  })
  @ApiResponse({
    status: 201,
    description: 'successfully review a business.',
  })
  create(
    @Body(new ValidationPipe({ transform: true }))
    createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.create(createReviewDto, req.user.id);
  }

  @Post(':id/responses')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(201)
  @ApiBody({
    type: ReplyReviewDto,
  })
  @ApiResponse({
    status: 201,
    description: 'OK.',
  })
  reply(
    @Param('id') id: string,
    @Body() replyReviewDto: ReplyReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.response(replyReviewDto, id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({
    type: EditReviewDto,
  })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  edit(
    @Param('id') id: string,
    @Body() editReviewDto: EditReviewDto,
    @Req() req: Request,
  ) {
    return this.reviewService.editReview(id, editReviewDto, req.user.id);
  }

  @Put(':id/responses')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiBody({
    type: EditResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  async editResponse(
    @Param('id') id: string,
    @Body() editResponseDto: EditResponseDto,
    @Req() req: Request,
  ) {
    return this.reviewService.editResponse(id, editResponseDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'type', enum: DeleteActionEnum, required: true })
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  async delete(
    @Param('id') id: string,
    @Query('type') type: string,
    @Req() req: Request,
  ) {
    if (type === DeleteActionEnum.SOFT) {
      return this.reviewService.softDelete(id, req.user.id);
    }

    if (type === DeleteActionEnum.HARD) {
      return this.reviewService.hardDelete(id, req.user);
    }
  }

  @Delete(':id/responses')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  async deleteResponses(@Param('id') id: string, @Req() req: Request) {
    return this.reviewService.deleteResponses(id, req.user.id);
  }
}
