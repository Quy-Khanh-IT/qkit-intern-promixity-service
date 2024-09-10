import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, Schema } from 'mongoose';
import { ReviewTypeEnum } from 'src/common/enums';
import { ReviewNotFoundException } from 'src/common/exceptions/review.exception';
import { transObjectIdToString, transStringToObjectId } from 'src/common/utils';
import { User } from 'src/modules/user/entities/user.entity';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { CommentDto } from '../dto/create-comment.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Comment } from '../entities/comment.entity';
import { Review } from '../entities/review.entity';
import { ReviewRepositoryInterface } from '../interfaces/review-repo.interface';
import { use } from 'passport';

interface Business {
  name: string;
  description: string;
  phoneNumber: string;
  website: string;
  userId: Schema.Types.ObjectId;
  // Include other fields as needed
}

export class ReviewRepository
  extends BaseRepositoryAbstract<Review>
  implements ReviewRepositoryInterface
{
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(reviewModel);
  }
  async getCommentsByReview(reviewId: string): Promise<Review[]> {
    // const comment = await this.reviewModel.findOne(
    //   {
    //     reviewId: transStringToObjectId(reviewId),
    //     page: 1,
    //   },
    //   { replies: 1 },
    //   { sort: { 'replies.created_at': -1 } },
    // );

    return;
  }

  async findReviewWithBusiness(reviewId: string): Promise<Review> {
    const review = await this.reviewModel
      .findOne({ _id: transStringToObjectId(reviewId) })
      .populate('businessId')
      .lean();

    return review;
  }

  async createReview(dto: CreateReviewDto, poster: User): Promise<Review> {
    const review = await this.reviewModel.create({
      businessId: transStringToObjectId(dto.businessId),
      postBy: {
        userId: poster._id,
        lastName: poster.lastName,
        firstName: poster.firstName,
        avatarUrl: poster.image,
        user_id: poster._id.toString(),
      },
      content: dto.content,
      type: ReviewTypeEnum.REVIEW,
      star: dto.star,
      emotion: dto.emotion ? dto.emotion : 'NORMAL',
    });

    review.id = transObjectIdToString(review._id);

    return review.toObject();
  }

  async createComment(
    dto: CommentDto,
    reviewId: string,
    user: User,
  ): Promise<Comment> {
    const review = await this.findReviewWithBusiness(reviewId);

    if (!review) {
      throw new ReviewNotFoundException();
    }

    const business = review.businessId as unknown as Business;

    let right: number;

    const maxRightNum = await this.commentModel.findOne(
      {
        reviewId: review._id,
        page: null,
      },
      {
        right: 1,
      },
      {
        sort: { right: -1 },
      },
    );

    if (maxRightNum) {
      right = maxRightNum.right + 1;
    } else {
      right = 1;
    }

    let newComment = await this.commentModel.create({
      reviewId: review._id,
      postBy: {
        userId: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        avatarUrl: user.image,
        user_id: user._id.toString(),
      },
      content: dto.content,
      type: ReviewTypeEnum.COMMENT,
      page: null,
      left: right,
      right: right + 1,
      depth: 1,
      isBusinessOwner: business.userId === user._id ? true : false,
      isAdmin: user.role === 'admin' ? true : false,
      _page: review.page ? review.page : 1,
      replies: [],
    });

    newComment = newComment.toObject();

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

    if (!updateComment.modifiedCount) {
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

      if (rev) {
        await this.commentModel.updateOne(
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
      }
    }

    return plainToClass(Comment, newComment);
  }

  async deleteComment(commentId: string) {
    const deleteComment = await this.commentModel.findByIdAndDelete(commentId);

    if (!deleteComment) {
      throw new ReviewNotFoundException();
    }

    console.log('deleteComment', deleteComment);

    //get last group comment which contain replies
    const groupsComment = await this.commentModel.aggregate([
      {
        $match: {
          reviewId: deleteComment.reviewId,
          page: { $ne: null },
        },
      },
      {
        $sort: {
          page: -1,
        },
      },
    ]);

    console.log('groupsComment[0]', groupsComment[0]);

    //replace deleted comment by last comment in replies
    const newestCommentInGroup =
      groupsComment[0].replies[groupsComment[0].count - 1];

    console.log('newestCommentInGroup', newestCommentInGroup);

    // => OK

    if (!(groupsComment.length === 1) && newestCommentInGroup) {
      const pullNewestComment = await this.commentModel.updateOne(
        {
          reviewId: groupsComment[0].reviewId,
          page: groupsComment[0].page,
        },
        {
          $pull: {
            replies: { _id: newestCommentInGroup._id },
          },
          $inc: { count: -1 },
        },
      );

      console.log('pullNewestComment', pullNewestComment);

      // => OK

      //replace

      const replaceDeletedComment = await this.commentModel.updateOne(
        {
          reviewId: deleteComment.reviewId,
          page: deleteComment._page,
        },
        {
          $set: {
            'replies.$[element]._id': newestCommentInGroup._id,
            'replies.$[element].postBy': newestCommentInGroup.postBy,
            'replies.$[element].content': newestCommentInGroup.content,
            'replies.$[element].depth': newestCommentInGroup.depth,
            'replies.$[element].created_at': newestCommentInGroup.created_at,
            'replies.$[element].updated_at': newestCommentInGroup.updated_at,
          },
        },
        {
          arrayFilters: [{ 'element._id': deleteComment._id }],
        },
      );

      console.log('replaceDeletedComment', replaceDeletedComment);

      // OK

      return !!replaceDeletedComment.modifiedCount;
    } else {
      //delete newest group comment
      console.log('groupsComment.length', groupsComment.length);
      if (!(groupsComment.length === 1)) {
        const deleteGroupComment = await this.commentModel.deleteOne({
          reviewId: groupsComment[0].reviewId,
          page: groupsComment[0].page,
        });

        console.log('deleteGroupComment', deleteGroupComment);

        // decrease page in review
        const decreasePage = await this.reviewModel.updateOne(
          {
            _id: deleteComment.reviewId,
          },
          {
            $inc: { page: -1 },
          },
        );
      }

      // pull delete comment
      const pullDeleteComment = await this.commentModel.findOneAndUpdate(
        {
          reviewId: deleteComment.reviewId,
          page: deleteComment._page,
        },
        {
          $pull: {
            replies: { _id: deleteComment._id },
          },
          $inc: { count: -1 },
        },
        {
          new: true,
        },
      );

      console.log('pullDeleteComment', pullDeleteComment);

      if (
        pullDeleteComment.page === 1 &&
        pullDeleteComment.count === 0 &&
        pullDeleteComment.replies.length === 0
      ) {
        const deleteGr = await this.commentModel.deleteOne({
          reviewId: pullDeleteComment.reviewId,
          page: 1,
        });

        console.log('deleteGr', deleteGr);

        // decrease page in review
        const decreasePage = await this.reviewModel.updateOne(
          {
            _id: groupsComment[0].reviewId,
          },
          {
            $inc: { page: -1 },
          },
        );

        console.log('decreasePage', decreasePage);
      }

      return !!pullDeleteComment;
    }
  }
}
