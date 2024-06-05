import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { ReviewRepositoryInterface } from '../interfaces/review-repo.interface';
import { Review } from '../entities/review2.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { CommentDto } from '../dto/reply-review.dto';
import { ReviewTypeEnum } from 'src/common/enums';
import { transStringToObjectId } from 'src/common/utils';
import { ReviewConstant } from 'src/common/constants/review.constant';
import { User } from 'src/modules/user/entities/user.entity';
import { ReviewNotFoundException } from 'src/common/exceptions/review.exception';
import { Comment } from '../entities/comment.entity';

export class Review2Repository
  extends BaseRepositoryAbstract<Review>
  implements ReviewRepositoryInterface
{
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(reviewModel);
  }
  async createReview(dto: CreateReviewDto, poster: User): Promise<Review> {
    console.log('poster', poster);

    const review = await this.reviewModel.create({
      businessId: transStringToObjectId(dto.businessId),
      postBy: {
        userId: poster._id,
        firstName: poster.firstName,
        avatarUrl: poster.image,
      },
      content: dto.content,
      type: ReviewTypeEnum.REVIEW,
      star: dto.star,
    });

    return review;
  }

  async createComment(dto: CommentDto, reviewId: string, user: User) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const newComment = await this.commentModel.create({
      reviewId: review._id,
      postBy: {
        userId: user._id,
        firstName: user.firstName,
        avatarUrl: '',
      },
      content: dto.content,
      type: ReviewTypeEnum.COMMENT,
      page: null,
      _page: review.page,
      replies: [],
    });

    console.log('newComment', newComment);

    console.log('review', review);

    const updateComment = await this.commentModel.updateOne(
      {
        reviewId: review._id,
        page: review.page,
        count: { $lt: 5 },
      },
      {
        $inc: { count: 1 },
        $push: {
          replies: newComment,
        },
      },
    );

    console.log('updateComment', updateComment);

    if (!updateComment.modifiedCount) {
      console.log('review', review);

      const rev = await this.reviewModel.findOneAndUpdate(
        {
          _id: review._id,
          page: review.page,
        },
        {
          $inc: { page: 1 },
        },
        { upsert: true, new: true },
      );

      console.log('rev', rev);

      if (rev) {
        console.log('newComment', newComment);
        const comm = await this.commentModel.updateOne(
          {
            reviewId: review._id,
            page: rev.page,
          },
          {
            $inc: { count: 1 },
            $push: {
              replies: newComment,
            },
          },
          {
            upsert: true,
          },
        );

        console.log('comm', comm);
      }
    }

    return newComment;
  }

  async deleteComment(commentId: string) {
    const comm = await this.commentModel.findByIdAndDelete(commentId);

    if (!comm) {
      throw new ReviewNotFoundException();
    }

    console.log('comm', comm);

    //get last comment in replies
    let lastGroupComm = await this.commentModel.aggregate([
      {
        $match: {
          reviewId: comm.reviewId,
          page: { $ne: null },
        },
      },
      {
        $sort: {
          page: -1,
        },
      },
    ]);

    console.log('lastGroupComm', lastGroupComm);

    //replace deleted comment by last comment in replies
    let lastComm = lastGroupComm[0].replies[lastGroupComm[0].count - 1];

    console.log('lastComm', lastComm);

    let newLastGroupComm = [];

    if (!lastComm) {
      await this.commentModel.deleteOne({
        reviewId: lastGroupComm[0].reviewId,
        page: lastGroupComm[0].page,
      });

      lastGroupComm = (await this.commentModel.aggregate([
        {
          $match: {
            reviewId: comm.reviewId,
            page: { $ne: null },
          },
        },
        {
          $sort: {
            page: -1,
          },
        },
      ])) as Comment[];

      await this.reviewModel.updateOne(
        {
          _id: lastGroupComm[0].reviewId,
        },
        {
          $inc: { page: -1 },
        },
      );

      console.log('newLastGroupComm', newLastGroupComm);

      lastComm = lastGroupComm[0].replies[lastGroupComm[0].count - 1];

      console.log('new lastComm', lastComm);
    }

    // pull last comment in replies
    console.log('lastGroupComm.length', lastGroupComm.length);
    if (lastGroupComm.length !== 1) {
      const pullComm = await this.commentModel.findOneAndUpdate(
        {
          reviewId: lastComm.reviewId,
          page: lastGroupComm[0].page,
        },
        {
          $pull: {
            replies: { _id: lastComm._id },
          },
          $inc: { count: -1 },
        },
      );

      console.log('pullComm', pullComm);

      // replace
      console.log('comm.reviewId', comm.reviewId);
      console.log('comm._page', comm._page);
      console.log('comm._id', comm._id);
      const replaceComm = await this.commentModel.updateOne(
        {
          reviewId: comm.reviewId,
          page: comm._page,
        },
        {
          $set: {
            'replies.$[element]._id': lastComm._id,
            'replies.$[element].postBy': lastComm.postBy,
            'replies.$[element].content': lastComm.content,
            // 'replies.$[element].type': lastComm.type,
            'replies.$[element].depth': lastComm.depth,
            'replies.$[element].created_at': lastComm.created_at,
            'replies.$[element].updated_at': lastComm.updated_at,
          },
        },
        {
          arrayFilters: [{ 'element._id': comm._id }],
        },
      );

      console.log('replaceComm', replaceComm);
    } else {
      const pullComm = await this.commentModel.findOneAndUpdate(
        {
          reviewId: comm.reviewId,
          page: comm._page,
        },
        {
          $pull: {
            replies: { _id: comm._id },
          },
          $inc: { count: -1 },
        },
      );

      console.log('pullComm 2', pullComm);
    }

    // const lastGroupComm = await this.commentModel.aggregate([
    //   {
    //     $match: {
    //       reviewId: comm.reviewId,
    //     },
    //   },
    //   {
    //     $sort: {
    //       page: -1,
    //     },
    //   },
    // ]);

    // console.log('lastGroupComm', lastGroupComm);

    // const lastComm = lastGroupComm[0].page;
    // console.log('lastComm', lastComm);

    return null;
  }
}
