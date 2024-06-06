import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Comment } from '../entities/comment.entity';
import { CommentRepositoryInterface } from '../interfaces/comment-repo.interface';
import { transStringToObjectId } from 'src/common/utils';
import { plainToClass } from 'class-transformer';

export class CommentRepository
  extends BaseRepositoryAbstract<Comment>
  implements CommentRepositoryInterface
{
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel);
  }

  // async getCommentsByReview(reviewId: string): Promise<any> {

  //   const comment = await this.commentModel.findOne({
  //     reviewId: transStringToObjectId(reviewId),
  //     page: 1,
  //   });

  //   return comment;
  //   // { replies: 1 },
  //   // { sort: { 'replies.created_at': -1 } },
  // }

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
