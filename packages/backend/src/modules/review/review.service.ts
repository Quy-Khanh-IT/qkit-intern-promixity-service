import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
import mongoose, { PipelineStage } from 'mongoose';
import { ConfigKey } from 'src/common/constants';
import {
  BusinessStatusEnum,
  ReviewActionEnum,
  ReviewTypeEnum,
  TypeSort,
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
} from 'src/common/exceptions/review.exception';
import { PaginationHelper } from 'src/common/helper';
import { transObjectIdToString, transStringToObjectId } from 'src/common/utils';
import { PaginationResult } from 'src/cores/pagination/base/pagination-result.base';

import { BusinessService } from '../business/business.service';
import { User } from '../user/entities/user.entity';
import { CommentFilter } from './dto/comment-filter.dto';
import { CommentQuery } from './dto/comment-query.dto';
import { CommentDto } from './dto/create-comment.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllBusinessReviewQuery } from './dto/find-all-business-review-query.dto';
import { FindAllReviewQuery } from './dto/find-all-review-query.dto';
import { Comment } from './entities/comment.entity';
import { Review, UserSchema } from './entities/review.entity';
import { CommentRepository } from './repository/comment.repository';
import { ReviewRepository } from './repository/review.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReviewWithCommentsAndBusinessInterface } from './interfaces/review.interface';
import { Business } from '../business/entities/business.entity';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    private readonly reviewRepository: ReviewRepository,
    private readonly commentRepository: CommentRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findAll(query: FindAllReviewQuery): Promise<PaginationResult<Review>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/reviews`;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.reviewRepository,
      this.configGetAllReviewPipeLine,
    );

    const reviews = aggregateResult.data.map(async (review) => {
      review.postBy = plainToClass(UserSchema, review.postBy);

      let reps = await this.getCommentsByReview(
        transObjectIdToString(review._id),
        {
          offset: 1,
          limit: 1,
        } as CommentFilter,
      );

      reps.data = reps?.data[0]?.replies;

      if (Array.isArray(reps.data)) {
        for (const i in reps.data) {
          const reviewId = reps.data[i].review_id;
          const id = reps.data[i].id;

          const replies = await this.getComments({
            reviewId: reviewId,
            parentCommentId: id,
          } as CommentQuery);

          reps.data[i].replies = [...replies];
        }
      }

      return {
        ...plainToClass(Review, review),
        reply: {
          ...reps,
        },
      };
    });

    aggregateResult.data = await Promise.all(reviews);

    return aggregateResult;
  }

  async configGetAllReviewPipeLine(
    query: FindAllReviewQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.userId) {
      matchStage['userId'] = transStringToObjectId(query.userId);
    }

    if (query.businessId) {
      matchStage['businessId'] = transStringToObjectId(query.businessId);
    }

    if (query.starsRating && query.starsRating.length > 0) {
      let arr = [];

      if (!Array.isArray(query.starsRating)) {
        arr.push(query.starsRating);
      } else {
        arr = query.starsRating;
      }

      matchStage['star'] = {
        $in: arr.map((star) => parseInt(star)),
      };
    }

    if (query.content) {
      matchStage['content'] = { $regex: query.content, $options: 'i' };
    }

    if (query.sortReportedCountBy) {
      sortStage['reportedCount'] =
        query.sortReportedCountBy === TypeSort.ASC ? 1 : -1;
    }

    if (query.firstName) {
      matchStage['postBy.firstName'] = {
        $regex: query.firstName,
        $options: 'i',
      };
    }

    if (query.lastName) {
      matchStage['postBy.lastName'] = { $regex: query.lastName, $options: 'i' };
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

  async findReviewBusiness(
    businessId: string,
    query: FindAllBusinessReviewQuery,
  ): Promise<PaginationResult<Review>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/reviews/${businessId}/filter`;

    query.businessId = businessId;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query as FindAllReviewQuery,
      this.reviewRepository,
      this.configGetAllBusinessReviewPipeLine,
    );

    const reviews = aggregateResult.data.map(async (review) => {
      review.postBy = plainToClass(UserSchema, review.postBy);

      let reps = await this.getCommentsByReview(
        transObjectIdToString(review._id),
        {
          offset: query.offset,
          limit: 1,
        } as CommentFilter,
      );

      reps.data = reps?.data[0]?.replies;

      if (Array.isArray(reps.data)) {
        for (const i in reps.data) {
          const reviewId = reps.data[i].review_id;
          const id = reps.data[i].id;

          const replies = await this.getComments({
            reviewId: reviewId,
            parentCommentId: id,
          } as CommentQuery);

          reps.data[i].replies = [...replies];
        }
      }

      return {
        ...plainToClass(Review, review),
        reply: {
          ...reps,
        },
      };
    });

    aggregateResult.data = await Promise.all(reviews);

    return aggregateResult;
  }

  async configGetAllBusinessReviewPipeLine(
    query: FindAllBusinessReviewQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.businessId) {
      matchStage['businessId'] = transStringToObjectId(query.businessId);
    }

    if (query.starsRating && query.starsRating.length > 0) {
      let arr = [];

      if (!Array.isArray(query.starsRating)) {
        arr.push(query.starsRating);
      } else {
        arr = query.starsRating;
      }

      matchStage['star'] = {
        $in: arr.map((star) => parseInt(star)),
      };
    }

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query as FindAllReviewQuery,
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

  async findById(
    id: string,
    filter?: CommentFilter,
  ): Promise<ReviewWithCommentsAndBusinessInterface> {
    const review = await this.reviewRepository.findReviewWithBusiness(id);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const business = review.businessId as unknown as Business;

    review.postBy = plainToClass(UserSchema, review.postBy);

    const reps = await this.getCommentsByReview(id, {
      offset: filter.offset,
      limit: 1,
    } as CommentFilter);

    reps.data = reps?.data[0]?.replies;

    console.log('reps', reps);

    if (Array.isArray(reps.data)) {
      for (const i in reps.data) {
        const reviewId = reps.data[i].review_id;
        const id = reps.data[i].id;

        const replies = await this.getComments({
          reviewId: reviewId,
          parentCommentId: id,
        } as CommentQuery);

        reps.data[i].replies = [...replies];
      }
    }

    return {
      ...plainToClass(Review, review),
      business_id: business.id,
      business: plainToClass(Business, business),
      reply: {
        ...reps,
      },
    };
  }

  async getCommentsByReview(
    reviewId: string,
    data: CommentFilter,
  ): Promise<any> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/reviews/${reviewId}/comments`;

    const aggregateResult = await PaginationHelper.commentPaginate(
      reviewId,
      URL,
      data,
      this.commentRepository,
      this.configGetCommentsByReviewPipeLine,
    );

    const comments = aggregateResult.data.map((comment) => {
      if (Array.isArray(comment.replies)) {
        comment.replies = comment.replies.map((rep) => {
          rep.postBy = plainToClass(UserSchema, rep.postBy);

          rep = plainToClass(Comment, rep);

          return {
            ...rep,
          };
        });
      }

      return {
        ...plainToClass(Comment, comment),
      };
    });

    aggregateResult.data = comments;

    return aggregateResult;
  }

  async configGetCommentsByReviewPipeLine(
    query: CommentFilter,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query as CommentFilter,
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

  async createReview(createReviewDto: CreateReviewDto, user: User) {
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

      const review = await this.reviewRepository.createReview(
        createReviewDto,
        user,
      );

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

  async createComment(commentDto: CommentDto, reviewId: string, user: User) {
    const comment = await this.reviewRepository.createComment(
      commentDto,
      reviewId,
      user,
    );

    comment.postBy = plainToInstance(UserSchema, comment.postBy);

    return comment;
  }

  async createReply(
    parentCommentId: string,
    commentDto: CommentDto,
    user: User,
  ) {
    const reply = await this.commentRepository.createReply(
      parentCommentId,
      commentDto,
      user,
    );

    return reply;
  }

  async getComments(query: CommentQuery): Promise<Comment[]> {
    const reviewId = query.reviewId;

    let review = await this.reviewRepository.findOneById(reviewId);

    if (!review) {
      review = await this.reviewRepository.findOneByConditionWithDeleted({
        _id: transStringToObjectId(reviewId),
      });

      if (!review) {
        throw new ReviewNotFoundException();
      }
    }

    const comments = await this.commentRepository.getComments(
      reviewId,
      query.parentCommentId,
    );

    return this.buildNestedComments(comments);
  }

  buildNestedComments(comments: Array<Comment>) {
    const commentMap: { [key: string]: Comment } = {};

    // Initialize the map
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    const nestedComments: Comment[] = [];

    comments.forEach((comment) => {
      if (comment.parent_id) {
        commentMap[comment.parent_id]?.replies?.push(commentMap[comment.id]);
      } else {
        nestedComments.push(commentMap[comment.id]);
      }
    });

    for (const key in commentMap) {
      nestedComments.push({
        ...commentMap[key],
        id: key,
      });
    }

    const finalData = [];

    let min = 0;
    let max = 0;

    nestedComments.forEach((comment) => {
      if (comment.left > min && comment.right > max) {
        min = comment.left;
        max = comment.right;

        finalData.push(comment);
      }
    });

    return JSON.parse(JSON.stringify(finalData, null, 2));
  }

  // async editReview(
  //   id: string,
  //   editReviewDto: EditReviewDto,
  //   senderId: string,
  // ): Promise<boolean> {
  //   const oldReview = await this.reviewRepository.findOneByCondition({
  //     _id: id,
  //     senderId: transStringToObjectId(senderId),
  //     type: ReviewTypeEnum.REVIEW,
  //     parentId: null, // ensure that this is a review, not a response
  //   });

  //   if (!oldReview) {
  //     throw new ReviewForbiddenException(
  //       "Can't edit this review. Review not found or not belong to user or not a review or not a review.",
  //     );
  //   }

  //   const transactionSession = await this.connection.startSession();

  //   try {
  //     transactionSession.startTransaction();

  //     const editedReview = await this.reviewRepository.update(id, {
  //       content: editReviewDto.content,
  //       star: parseInt(editReviewDto.star),
  //     });

  //     await this.businessService.updateRating(
  //       editedReview.businessId.toString(),
  //       ReviewActionEnum.EDIT,
  //       editedReview.star.toString(),
  //       oldReview.star.toString(),
  //     );

  //     await transactionSession.commitTransaction();
  //     transactionSession.endSession();

  //     return !!editedReview;
  //   } catch (err) {
  //     await transactionSession.abortTransaction();
  //     transactionSession.endSession();

  //     throw new ReviewForbiddenException('Edit review failed.');
  //   }
  // }

  // async editComment(
  //   id: string,
  //   editResponseDto: EditResponseDto,
  //   senderId: string,
  // ): Promise<boolean> {
  //   const response = await this.reviewRepository.findOneByCondition({
  //     _id: transStringToObjectId(id),
  //     senderId: transStringToObjectId(senderId),
  //     type: ReviewTypeEnum.COMMENT,
  //   });

  //   if (!response) {
  //     throw new ResponseNotFoundException(
  //       "Can't edit this response. Response not found or not belong to user or not a response.",
  //     );
  //   }

  //   const editedResponse = await this.reviewRepository.update(id, {
  //     content: editResponseDto.content,
  //   });

  //   return !!editedResponse;
  // }

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

  // async hardDelete(id: string, user: User): Promise<boolean> {
  //   if (user.role !== UserRole.ADMIN) {
  //     throw new ReviewUnauthorizeException();
  //   }

  //   const review = await this.reviewRepository.findOneByConditionWithDeleted({
  //     _id: transStringToObjectId(id),
  //     type: ReviewTypeEnum.REVIEW,
  //     parentId: null, // ensure that this is a review, not a response
  //   });

  //   if (!review) {
  //     throw new ReviewDeleteException(
  //       'Review was not deleted or review not found.',
  //     );
  //   }

  //   return !!(await this.deleteWithChildren(id));
  // }

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

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const comm = await this.commentRepository.findOneById(commentId);

    if (!comm) {
      throw new ResponseNotFoundException();
    }

    if (comm.postBy.userId.toString() !== userId) {
      throw new ReviewForbiddenException();
    }

    const comment = await this.reviewRepository.deleteComment(commentId);

    return !!comment;
  }

  async restore() {}

  async reportReview(reviewId: string, user: User): Promise<boolean> {
    const review = await this.reviewRepository.findOneById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const reportedReview = await this.reviewRepository.update(reviewId, {
      reportedCount: review.reportedCount + 1,
    });

    if (!reportedReview) {
      return false;
    }

    // send notification

    // this.eventEmitter.emit(
    //   EventDispatcherEnum.CREATE_BUSINESS,
    //   new ReportReviewEvent({
    //     title: 'Review reported',
    //     content: `A review has been reported (review id: ${review.id})`,
    //     senderId: user.id,
    //     receiverId: null,
    //   }),
    // );

    return !!reportedReview;
  }
}
