import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '../business/business.module';
import { Review, ReviewSchema } from './entities/review2.entity';
import { ReviewRepository } from './repository/review.repository';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review2Repository } from './repository/review2.repository';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Review.name,
        schema: ReviewSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    BusinessModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, Review2Repository],
  exports: [ReviewService],
})
export class ReviewModule {}
