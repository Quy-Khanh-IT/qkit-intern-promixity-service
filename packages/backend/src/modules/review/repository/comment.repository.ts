import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Comment } from '../entities/comment.entity';
import { CommentRepositoryInterface } from '../interfaces/comment-repo.interface';
import { transObjectIdToString, transStringToObjectId } from 'src/common/utils';
import { plainToClass } from 'class-transformer';
import { CommentDto } from '../dto/create-comment.dto';
import { ReviewTypeEnum } from 'src/common/enums';
import { User } from 'src/modules/user/entities/user.entity';
import { UserSchema } from '../entities/review.entity';
import { repl } from '@nestjs/core';

export class CommentRepository
  extends BaseRepositoryAbstract<Comment>
  implements CommentRepositoryInterface
{
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }

  async createReply(parentCommentId: string, dto: CommentDto, user: User) {
    const parent = await this.commentModel.findOne({
      _id: transStringToObjectId(parentCommentId),
      page: null,
    });

    if (!parent) {
      throw new Error('Parent comment not found');
    }

    const right = parent.right;

    console.log('right', right);
    const updateRight = await this.commentModel.updateMany(
      { reviewId: parent.reviewId, right: { $gte: right }, page: null },
      { $inc: { right: 2 } },
    );

    console.log('updateRight', updateRight);

    const updateLeft = await this.commentModel.updateMany(
      { reviewId: parent.reviewId, left: { $gt: right }, page: null },
      { $inc: { left: 2 } },
    );

    console.log('updateLeft', updateLeft);

    const newReply = await this.commentModel.create({
      ...dto,
      reviewId: parent.reviewId,
      parentId: parent._id,
      page: null,
      type: ReviewTypeEnum.COMMENT,
      postBy: {
        userId: user._id,
        firstName: user.firstName,
        avatarUrl: '',
        user_id: user._id.toString(),
      },
      left: right,
      right: right + 1,
    });

    newReply.id = transObjectIdToString(newReply._id);

    return plainToClass(Comment, newReply.toObject());
  }

  async getComments(reviewId: string, parentCommentId?: string) {
    if (parentCommentId) {
      const parent = await this.commentModel.findById(parentCommentId);

      if (!parent) {
        throw new Error('Parent comment not found');
      }

      const comments = await this.commentModel
        .find({
          reviewId: transStringToObjectId(reviewId),
          left: { $gt: parent.left },
          right: { $lte: parent.right },
          page: null,
        })
        .select({
          content: 1,
          postBy: 1,
          reviewId: 1,
          createdAt: 1,
          updatedAt: 1,
          parentId: 1,
          left: 1,
          right: 1,
        })
        .sort({ left: 1 })
        .lean();

      return comments.map((comment) => {
        comment.postBy = plainToClass(UserSchema, comment.postBy);
        return {
          ...plainToClass(Comment, comment),
          postBy: comment.postBy,
          replies: [],
        };
      });
    }

    const comments = await this.commentModel
      .find({
        reviewId: transStringToObjectId(reviewId),
        parentId: parentCommentId,
        page: null,
      })
      .select({
        content: 1,
        postBy: 1,
        createdAt: 1,
        updatedAt: 1,
        left: 1,
        right: 1,
      })
      .sort({ left: 1 });

    return comments.map((comment) => {
      comment.id = transObjectIdToString(comment._id);
      return comment.toObject();
    });
  }

  async getCommentsByReview(reviewId: string): Promise<any> {
    const comment = await this.commentModel
      .find({
        reviewId: transStringToObjectId(reviewId),
        page: 2,
      })
      .lean()
      .exec();

    return comment;
    // { replies: 1 },
    // { sort: { 'replies.created_at': -1 } },
  }
}
