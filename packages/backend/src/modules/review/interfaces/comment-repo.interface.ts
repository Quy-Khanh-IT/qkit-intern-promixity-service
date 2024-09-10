import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';

import { Comment } from '../entities/comment.entity';

export interface CommentRepositoryInterface
  extends BaseRepositoryInterface<Comment> {
  getCommentsByReview(reviewId: string): Promise<any>;
}
