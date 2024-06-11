import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToClass, plainToInstance } from 'class-transformer';
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
import { CommentDto } from './dto/create-comment.dto';
import { Review, UserSchema } from './entities/review.entity';
import { transObjectIdToString, transStringToObjectId } from 'src/common/utils';
import { User } from '../user/entities/user.entity';
import { Business } from '../business/entities/business.entity';
import { FindAllBusinessReviewQuery } from './dto/find-all-business-review-query.dto';
import { ReviewRepository } from './repository/review.repository';
import { CommentRepository } from './repository/comment.repository';
import { Comment } from './entities/comment.entity';
import { ResponseSchema } from './entities/response.entity';
import { CommentQuery } from './dto/comment-query.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    private readonly reviewRepository: ReviewRepository,
    private readonly commentRepository: CommentRepository,
    private readonly configService: ConfigService,
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

    const reviews = aggregateResult.data.map((review) =>
      plainToClass(Review, review),
    );

    aggregateResult.data = reviews;

    return aggregateResult;
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

    const reviews = aggregateResult.data.map((review) =>
      plainToClass(Review, review),
    );

    aggregateResult.data = reviews;

    return aggregateResult;
  }

  async configGetAllBusinessReviewPipeLine(
    query: FindAllBusinessReviewQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

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
        $in: arr,
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

  async configGetAllReviewPipeLine(
    query: FindAllReviewQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.content) {
      matchStage['content'] = { $regex: query.content, $options: 'i' };
    }

    // if (query.type) {
    //   let arr = [];

    //   if (!Array.isArray(query.type)) {
    //     arr.push(query.type);
    //   } else {
    //     arr = query.type;
    //   }

    //   matchStage['type'] = {
    //     $in: arr,
    //   };
    // }

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

    console.log('review', review);

    return plainToClass(Review, review);
  }

  async getCommentsByReview(reviewId: string): Promise<any> {
    // const review = await this.reviewRepository.findOneById(reviewId);

    // if (!review) {
    //   throw new ReviewNotFoundException();
    // }

    // console.log('review', review);

    // const rev = await this.commentRepository.findOneByCondition({
    //   reviewId: transStringToObjectId(reviewId),
    //   page: 1,
    // });

    const rev = await this.commentRepository.getCommentsByReview(reviewId);

    const replies = rev[0].replies.map((item) => {
      item.postBy = plainToClass(UserSchema, item.postBy);

      return plainToClass(ResponseSchema, item);
    });

    rev[0].replies = replies;

    return plainToClass(Comment, rev);
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

      let review = await this.reviewRepository.createReview(
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
    let comment = await this.reviewRepository.createComment(
      commentDto,
      reviewId,
      user,
    );

    comment.postBy = plainToInstance(UserSchema, comment.postBy);

    return plainToClass(Review, comment);
  }

  async createReply(
    parentCommentId: string,
    commentDto: CommentDto,
    user: User,
  ) {
    let reply = await this.commentRepository.createReply(
      parentCommentId,
      commentDto,
      user,
    );

    console.log('reply', reply);

    return reply;
  }

  async getComments(query: CommentQuery) {
    const reviewId = query.reviewId;

    const review = await this.reviewRepository.findOneById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const comments = await this.commentRepository.getComments(
      reviewId,
      query.parentCommentId,
    );

    console.log('comments', comments);

    return this.buildNestedComments(comments);
  }

  buildNestedComments(comments: Array<Comment>) {
    const commentMap: { [key: string]: Comment } = {};

    // Initialize the map
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    let nestedComments: Comment[] = [];

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

    let finalData = [];

    let min = 0;
    let max = 0;

    nestedComments.forEach((comment) => {
      if (comment.left > min && comment.right > max) {
        min = comment.left;
        max = comment.right;

        finalData.push(comment);
      }
    });

    return JSON.stringify(finalData, null, 2);
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

  // async softDelete(id: string, user: User): Promise<boolean> {
  //   let review: Review;

  //   if (user.role === UserRole.ADMIN) {
  //     review = await this.reviewRepository.findOneByCondition({
  //       _id: transStringToObjectId(id),
  //       type: ReviewTypeEnum.REVIEW,
  //       parentId: null,
  //       deleted_at: null,
  //     });
  //   } else {
  //     review = await this.reviewRepository.findOneByCondition({
  //       _id: transStringToObjectId(id),
  //       senderId: user._id,
  //       type: ReviewTypeEnum.REVIEW,
  //       parentId: null,
  //       deleted_at: null,
  //     });

  //     if (!review) {
  //       throw new ReviewDeleteException(
  //         "Can't delete this review. Review not found or not belong to user or already deleted or not a review.",
  //       );
  //     }
  //   }

  //   console.log('review', review);

  //   const transactionSession = await this.connection.startSession();

  //   try {
  //     transactionSession.startTransaction();

  //     await this.businessService.updateRating(
  //       review.businessId.toString(),
  //       ReviewActionEnum.DELETE,
  //       review.star.toString(),
  //     );

  //     const deletedReview = await this.reviewRepository.softDelete(id);

  //     await transactionSession.commitTransaction();
  //     transactionSession.endSession();

  //     return !!deletedReview;
  //   } catch (err) {
  //     await transactionSession.abortTransaction();
  //     transactionSession.endSession();

  //     return false;
  //   }
  // }

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

  // async restoreReview(reviewId: string) {
  //   const review = await this.reviewRepository.findOneByConditionWithDeleted({
  //     _id: transStringToObjectId(reviewId),
  //     type: ReviewTypeEnum.REVIEW,
  //     parentId: null, // ensure that this is a review, not a response
  //   });

  //   if (!review) {
  //     throw new ReviewNotFoundException(
  //       "Can't restore this review. Review are not deleted or not found.",
  //     );
  //   }

  //   const transactionSession = await this.connection.startSession();

  //   try {
  //     transactionSession.startTransaction();

  //     await this.businessService.updateRating(
  //       review.businessId.toString(),
  //       ReviewActionEnum.RESTORE,
  //       review.star.toString(),
  //     );

  //     const restoreReview = await this.reviewRepository.restore(review.id);

  //     await transactionSession.commitTransaction();
  //     transactionSession.endSession();

  //     return !!restoreReview;
  //   } catch (err) {
  //     await transactionSession.abortTransaction();
  //     transactionSession.endSession();

  //     return false;
  //   }

  //   return !!(await this.reviewRepository.restore(review.id));
  // }

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

  // async deleteWithChildren(id: string) {
  //   const children = await this.reviewRepository.findAll({
  //     parentId: id,
  //   });

  //   // Recursively delete each child review
  //   for (const child of children.items) {
  //     await this.deleteWithChildren(child.id);
  //   }

  //   return !!(await this.reviewRepository.hardDelete(id));
  // }

  async getReviewsByBusinessId(businessId: string) {}

  async restore() {}
}
