import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ReviewConstant } from 'src/common/constants/review.constant';
import { ReviewActionEnum, StarEnum, UserRole } from 'src/common/enums';
import { BusinessNotFoundException } from 'src/common/exceptions/business.exception';
import {
  ResponseNotFoundException,
  ReviewDeleteException,
  ReviewForbiddenException,
  ReviewNotFoundException,
} from 'src/common/exceptions/review.exception';

import { BusinessService } from '../business/business.service';
import { User } from '../user/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { EditResponseDto } from './dto/edit-response.dto';
import { EditReviewDto } from './dto/edit-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repository/review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly reviewRepository: ReviewRepository,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findById(id: string): Promise<Review> {
    return await this.reviewRepository.findOneById(id);
  }

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const business = await this.businessService.getById(
      createReviewDto.businessId,
    );

    if (!business) {
      throw new BusinessNotFoundException();
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const review = await this.reviewRepository.create({
        comment: createReviewDto.comment,
        star: StarEnum[createReviewDto.star],
        business_id: business.id,
        user_id: userId,
      });

      const updatedBusiness = await this.businessService.updateRating(
        business.id,
        ReviewActionEnum.CREATE,
        createReviewDto.star,
      );

      await transactionSession.commitTransaction();

      return review;
    } catch (err) {
      await transactionSession.abortTransaction();

      transactionSession.endSession();

      throw err;
    }
  }

  async response(
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

    const newResponse = await this.reviewRepository.create({
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

    return newResponse;
  }

  async editReview(
    id: string,
    editReviewDto: EditReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
      parent_id: null, // ensure that this is a review, not a response
      deleted_at: null, // ensure that this review is not deleted
    });

    if (!review) {
      throw new ReviewForbiddenException(
        "Can't edit this review. Review not found or not belong to user or not a review.",
      );
    }

    const editedReview = await this.reviewRepository.update(id, {
      comment: editReviewDto.comment,
      star: parseInt(editReviewDto.star),
    });

    return editedReview;
  }

  async editResponse(
    id: string,
    editResponseDto: EditResponseDto,
    userId: string,
  ): Promise<Review> {
    const response = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
    });

    if (!response) {
      throw new ResponseNotFoundException(
        "Can't edit this response. Response not found or not belong to user.",
      );
    }

    const editedResponse = await this.reviewRepository.update(id, {
      comment: editResponseDto.comment,
    });

    return editedResponse;
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
      parent_id: null,
      deleted_at: null,
    });

    if (!review) {
      throw new ReviewDeleteException(
        "Can't delete this review. Review not found or not belong to user or already deleted.",
      );
    }

    return !!(await this.reviewRepository.softDelete(id));
  }

  async hardDelete(id: string, user: User): Promise<boolean> {
    const { role } = user;

    if (role !== UserRole.ADMIN) {
      throw new ReviewDeleteException('Only admin can hard delete.');
    }

    const review = await this.reviewRepository.findOneByConditionWithDeleted({
      _id: id,
      parent_id: null, // ensure that this is a review, not a response
    });

    if (!review) {
      throw new ReviewDeleteException(
        'Review was not deleted or review not found.',
      );
    }

    return !!(await this.reviewRepository.hardDelete(id));
  }

  async deleteResponses(id: string, userId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
    });

    if (!review) {
      throw new ResponseNotFoundException(
        "Can't delete this response. Response not found or not belong to user.",
      );
    }

    return !!(await this.reviewRepository.hardDelete(id));
  }
}
