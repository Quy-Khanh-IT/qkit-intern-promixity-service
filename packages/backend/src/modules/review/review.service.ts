import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ReviewConstant } from 'src/common/constants/review.constant';
import {
  BusinessStatusEnum,
  ReviewActionEnum,
  ReviewTypeEnum,
  StarEnum,
} from 'src/common/enums';
import {
  BusinessNotFoundException,
  BusinessStatusException,
} from 'src/common/exceptions/business.exception';
import {
  ResponseNotFoundException,
  ReviewDeleteException,
  ReviewForbiddenException,
  ReviewNotFoundException,
} from 'src/common/exceptions/review.exception';

import { BusinessService } from '../business/business.service';
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

    if (business.status !== BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException(
        "Can't review this business. Business is not approved.",
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const review = await this.reviewRepository.create({
        comment: createReviewDto.comment,
        star: StarEnum[createReviewDto.star],
        type: ReviewTypeEnum.REVIEW,
        business_id: business.id,
        user_id: userId,
      });

      await this.businessService.updateRating(
        business.id,
        ReviewActionEnum.CREATE,
        createReviewDto.star,
      );

      await transactionSession.commitTransaction();
      transactionSession.endSession();

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

    if (currentDepth === ReviewConstant.MAX_DEPTH) {
      parentReviewId = review.parent_id.toString();
    }

    const newResponse = await this.reviewRepository.create({
      comment: replyReviewDto.comment,
      star: null,
      business_id: review.business_id,
      user_id: userId,
      parent_id: parentReviewId,
      type: ReviewTypeEnum.REPLY,
      depth:
        currentDepth < ReviewConstant.MAX_DEPTH
          ? currentDepth + 1
          : ReviewConstant.MAX_DEPTH,
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
    const oldReview = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
      type: ReviewTypeEnum.REVIEW,
      parent_id: null, // ensure that this is a review, not a response
      deleted_at: null, // ensure that this review is not deleted
    });

    if (!oldReview) {
      throw new ReviewForbiddenException(
        "Can't edit this review. Review not found or not belong to user or not a review or not a review.",
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const editedReview = await this.reviewRepository.update(id, {
        comment: editReviewDto.comment,
        star: parseInt(editReviewDto.star),
      });

      await this.businessService.updateRating(
        editedReview.business_id.toString(),
        ReviewActionEnum.EDIT,
        editedReview.star.toString(),
        oldReview.star.toString(),
      );

      await transactionSession.commitTransaction();
      transactionSession.endSession();

      return editedReview;
    } catch (err) {
      await transactionSession.abortTransaction();
      transactionSession.endSession();

      throw new ReviewForbiddenException('Edit review failed.');
    }
  }

  async editResponse(
    id: string,
    editResponseDto: EditResponseDto,
    userId: string,
  ): Promise<Review> {
    const response = await this.reviewRepository.findOneByCondition({
      _id: id,
      user_id: userId,
      type: ReviewTypeEnum.REPLY,
    });

    if (!response) {
      throw new ResponseNotFoundException(
        "Can't edit this response. Response not found or not belong to user or not a response.",
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
      type: ReviewTypeEnum.REVIEW,
      parent_id: null,
      deleted_at: null,
    });

    if (!review) {
      throw new ReviewDeleteException(
        "Can't delete this review. Review not found or not belong to user or already deleted or not a review.",
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      await this.businessService.updateRating(
        review.business_id.toString(),
        ReviewActionEnum.DELETE,
        review.star.toString(),
      );

      const deletedReview = await this.reviewRepository.softDelete(id);

      await transactionSession.commitTransaction();
      transactionSession.endSession();

      return !!deletedReview;
    } catch (err) {
      await transactionSession.abortTransaction();
      transactionSession.endSession();

      return false;
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findOneByConditionWithDeleted({
      _id: id,
      type: ReviewTypeEnum.REVIEW,
      parent_id: null, // ensure that this is a review, not a response
    });

    if (!review) {
      throw new ReviewDeleteException(
        'Review was not deleted or review not found.',
      );
    }

    return !!(await this.deleteWithChildren(id));
  }

  async deleteResponses(id: string, userId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOneByCondition({
      _id: id,
      type: ReviewTypeEnum.REPLY,
      user_id: userId,
    });

    if (!review) {
      throw new ResponseNotFoundException(
        "Can't delete this response. Response not found or not belong to user or not a response.",
      );
    }

    return !!(await this.deleteWithChildren(id));
  }

  async deleteWithChildren(id: string) {
    const children = await this.reviewRepository.findAll({
      parent_id: id,
    });

    // Recursively delete each child review
    for (const child of children.items) {
      await this.deleteWithChildren(child.id);
    }

    return !!(await this.reviewRepository.hardDelete(id));
  }
}
