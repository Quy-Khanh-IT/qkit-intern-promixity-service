import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';
import { User } from 'src/modules/user/entities/user.entity';

import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';

export interface ReviewRepositoryInterface
  extends BaseRepositoryInterface<Review> {
  createReview(dto: CreateReviewDto, poster: User);

  getCommentsByReview(reviewId: string): Promise<Review[]>;
}
