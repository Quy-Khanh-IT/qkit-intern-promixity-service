import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '../business/business.module';
import { Comment, CommentSchema } from './entities/comment.entity';
import { Review, ReviewSchema } from './entities/review.entity';
import { CommentRepository } from './repository/comment.repository';
import { ReviewRepository } from './repository/review.repository';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

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
