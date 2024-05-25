import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
@ApiTags('reviews')
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(201)
  @ApiBody({
    type: CreateReviewDto,
  })
  @ApiResponse({
    status: 201,
    description: 'successfully review a business.',
  })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: Request) {
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
    return this.reviewService.reply(replyReviewDto, id, req.user.id);
  }
}
