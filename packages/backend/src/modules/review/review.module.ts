import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '../business/business.module';
import { Review, ReviewSchema } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Comment, CommentSchema } from './entities/comment.entity';
import { ReviewRepository } from './repository/review.repository';
import { CommentRepository } from './repository/comment.repository';

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
    forwardRef(() => BusinessModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, CommentRepository, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
