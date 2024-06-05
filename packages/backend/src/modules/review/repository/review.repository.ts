import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Review } from '../entities/review2.entity';

export class ReviewRepository extends BaseRepositoryAbstract<Review> {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {
    super(reviewModel);
  }
}
