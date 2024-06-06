import { ReviewActionEnum } from 'src/common/enums';
import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';

import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { User } from 'src/modules/user/entities/user.entity';

export interface ReviewRepositoryInterface
  extends BaseRepositoryInterface<Review> {
  createReview(dto: CreateReviewDto, poster: User);

  getCommentsByReview(reviewId: string): Promise<Review[]>;
}
