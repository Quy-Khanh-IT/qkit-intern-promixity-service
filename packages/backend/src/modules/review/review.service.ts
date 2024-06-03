import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import mongoose, { PipelineStage } from 'mongoose';
import { ConfigKey } from 'src/common/constants';
import { ReviewConstant } from 'src/common/constants/review.constant';
import {
  BusinessStatusEnum,
  ReviewActionEnum,
  ReviewTypeEnum,
  StarEnum,
  UserRole,
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
  ReviewUnauthorizeException,
} from 'src/common/exceptions/review.exception';
import { PaginationHelper } from 'src/common/helper';
import { PaginationResult } from 'src/cores/pagination/base/pagination-result.base';

import { BusinessService } from '../business/business.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { EditResponseDto } from './dto/edit-response.dto';
import { EditReviewDto } from './dto/edit-review.dto';
import { FindAllReviewQuery } from './dto/find-all-review-query.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repository/review.repository';
import { transStringToObjectId } from 'src/common/utils';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly reviewRepository: ReviewRepository,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findAll(query: FindAllReviewQuery): Promise<PaginationResult<Review>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/reviews`;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.reviewRepository,
      this.configGetAllBusinessPipeLine,
    );

    const reviews = aggregateResult.data.map((review) =>
      plainToClass(Review, review),
    );

    aggregateResult.data = reviews;

    return aggregateResult;
  }

  async configGetAllBusinessPipeLine(
    query: FindAllReviewQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.content) {
      matchStage['content'] = { $regex: query.content, $options: 'i' };
    }

    if (query.type) {
      let arr = [];

      if (!Array.isArray(query.type)) {
        arr.push(query.type);
      } else {
        arr = query.type;
      }

      matchStage['type'] = {
        $in: arr,
      };
    }

    if (query.starsRating && query.starsRating.length > 0) {
      let arr = [];

      if (!Array.isArray(query.starsRating)) {
        arr.push(query.starsRating);
      } else {
        arr = query.starsRating;
      }

      matchStage['star'] = {
        $in: arr,
      };
    }

    if (query.userId) {
      matchStage['userId'] = transStringToObjectId(query.userId);
    }

    if (query.businessId) {
      matchStage['businessId'] = transStringToObjectId(query.businessId);
    }

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query,
    );

    matchStage = result.matchStage;
    sortStage = result.sortStage;

    if (Object.keys(matchStage).length > 0) {
      finalPipeline.push({ $match: matchStage });
    }

    if (Object.keys(sortStage).length > 0) {
      finalPipeline.push({ $sort: sortStage });
    }

    return finalPipeline;
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOneById(id);

    return plainToClass(Review, review);
  }

  async createPreview(createReviewDto: CreateReviewDto, user: User) {
    const business = await this.businessService.findOneById(
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
        content: createReviewDto.content,
        star: parseInt(createReviewDto.star),
        type: ReviewTypeEnum.REVIEW,
        businessId: transStringToObjectId(business.id),
        senderId: user._id,
        receiverId: transStringToObjectId(business.user_id),
      });

      await this.businessService.updateRating(
        business.id,
        ReviewActionEnum.CREATE,
        createReviewDto.star,
      );

      await transactionSession.commitTransaction();
      transactionSession.endSession();

      return plainToClass(Review, review);
    } catch (err) {
      await transactionSession.abortTransaction();

      transactionSession.endSession();

      throw err;
    }
  }

  async createResponse(
    replyReviewDto: ReplyReviewDto,
    parentReviewId: string,
    senderId: string,
  ) {
    const review = await this.reviewRepository.findOneById(parentReviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const currentDepth = review.depth;

    if (currentDepth === ReviewConstant.MAX_DEPTH) {
      parentReviewId = review.parentId.toString();
    }

    const newResponse = await this.reviewRepository.create({
      content: replyReviewDto.content,
      star: null,
      businessId: review.businessId,
      senderId: transStringToObjectId(senderId),
      parentId: transStringToObjectId(parentReviewId),
      receiverId: review.senderId,
      type: ReviewTypeEnum.REPLY,
      depth:
        currentDepth < ReviewConstant.MAX_DEPTH
          ? currentDepth + 1
          : ReviewConstant.MAX_DEPTH,
    });

    return plainToClass(Review, newResponse);
  }

  async editReview(
    id: string,
    editReviewDto: EditReviewDto,
    senderId: string,
  ): Promise<boolean> {
    const oldReview = await this.reviewRepository.findOneByCondition({
      _id: id,
      senderId: transStringToObjectId(senderId),
      type: ReviewTypeEnum.REVIEW,
      parentId: null, // ensure that this is a review, not a response
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
        content: editReviewDto.content,
        star: parseInt(editReviewDto.star),
      });

      await this.businessService.updateRating(
        editedReview.businessId.toString(),
        ReviewActionEnum.EDIT,
        editedReview.star.toString(),
        oldReview.star.toString(),
      );

      await transactionSession.commitTransaction();
      transactionSession.endSession();

      return !!editedReview;
    } catch (err) {
      await transactionSession.abortTransaction();
      transactionSession.endSession();

      throw new ReviewForbiddenException('Edit review failed.');
    }
  }

  async editResponse(
    id: string,
    editResponseDto: EditResponseDto,
    senderId: string,
  ): Promise<boolean> {
    const response = await this.reviewRepository.findOneByCondition({
      _id: transStringToObjectId(id),
      senderId: transStringToObjectId(senderId),
      type: ReviewTypeEnum.REPLY,
    });

    if (!response) {
      throw new ResponseNotFoundException(
        "Can't edit this response. Response not found or not belong to user or not a response.",
      );
    }

    const editedResponse = await this.reviewRepository.update(id, {
      content: editResponseDto.content,
    });

    return !!editedResponse;
  }

  async softDelete(id: string, user: User): Promise<boolean> {
    let review: Review;

    if (user.role === UserRole.ADMIN) {
      review = await this.reviewRepository.findOneByCondition({
        _id: transStringToObjectId(id),
        type: ReviewTypeEnum.REVIEW,
        parentId: null,
        deleted_at: null,
      });
    } else {
      review = await this.reviewRepository.findOneByCondition({
        _id: transStringToObjectId(id),
        senderId: user._id,
        type: ReviewTypeEnum.REVIEW,
        parentId: null,
        deleted_at: null,
      });

      if (!review) {
        throw new ReviewDeleteException(
          "Can't delete this review. Review not found or not belong to user or already deleted or not a review.",
        );
      }
    }

    console.log('review', review);

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      await this.businessService.updateRating(
        review.businessId.toString(),
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

  async hardDelete(id: string, user: User): Promise<boolean> {
    if (user.role !== UserRole.ADMIN) {
      throw new ReviewUnauthorizeException();
    }

    const review = await this.reviewRepository.findOneByConditionWithDeleted({
      _id: transStringToObjectId(id),
      type: ReviewTypeEnum.REVIEW,
      parentId: null, // ensure that this is a review, not a response
    });

    if (!review) {
      throw new ReviewDeleteException(
        'Review was not deleted or review not found.',
      );
    }

    return !!(await this.deleteWithChildren(id));
  }

  async restoreReview(reviewId: string) {
    const review = await this.reviewRepository.findOneByConditionWithDeleted({
      _id: transStringToObjectId(reviewId),
      type: ReviewTypeEnum.REVIEW,
      parentId: null, // ensure that this is a review, not a response
    });

    if (!review) {
      throw new ReviewNotFoundException(
        "Can't restore this review. Review are not deleted or not found.",
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      await this.businessService.updateRating(
        review.businessId.toString(),
        ReviewActionEnum.RESTORE,
        review.star.toString(),
      );

      const restoreReview = await this.reviewRepository.restore(review.id);

      await transactionSession.commitTransaction();
      transactionSession.endSession();

      return !!restoreReview;
    } catch (err) {
      await transactionSession.abortTransaction();
      transactionSession.endSession();

      return false;
    }

    return !!(await this.reviewRepository.restore(review.id));
  }

  async deleteResponses(id: string, userId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOneByCondition({
      _id: id,
      type: ReviewTypeEnum.REPLY,
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
      parentId: id,
    });

    // Recursively delete each child review
    for (const child of children.items) {
      await this.deleteWithChildren(child.id);
    }

    return !!(await this.reviewRepository.hardDelete(id));
  }

  async restore() {}
}
