import { Injectable } from '@nestjs/common';
import { ReviewConstant } from 'src/common/constants/review.constant';
import { BusinessNotFoundException } from 'src/common/exceptions/business.exception';
import { ReviewNotFoundException } from 'src/common/exceptions/review.exception';

import { BusinessService } from '../business/business.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const business = await this.businessService.getById(
      createReviewDto.businessId,
    );

    if (!business) {
      throw new BusinessNotFoundException();
    }

    const review = await this.reviewRepository.create({
      comment: createReviewDto.comment,
      star: createReviewDto.star,
      business_id: createReviewDto.businessId,
      user_id: userId,
    });

    return review;
  }

  async reply(
    replyReviewDto: ReplyReviewDto,
    parentReviewId: string,
    userId: string,
  ) {
    const review = await this.reviewRepository.findOneById(parentReviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const currentDepth = review.depth;

    if (currentDepth === ReviewConstant.MAX_REVIEW_DEPTH) {
      parentReviewId = review.parent_id.toString();
    }

    const newReply = await this.reviewRepository.create({
      comment: replyReviewDto.comment,
      star: null,
      business_id: review.business_id,
      user_id: userId,
      parent_id: parentReviewId,
      depth:
        currentDepth < ReviewConstant.MAX_REVIEW_DEPTH
          ? currentDepth + 1
          : ReviewConstant.MAX_REVIEW_DEPTH,
      // can_reply: currentDepth + 1 < 3,
      // is_business_owner_reply: business.user_id.toString() === userId,
    });

    return newReply;
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
