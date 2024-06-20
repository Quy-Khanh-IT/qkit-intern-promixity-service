import { Review } from '../entities/review.entity';

export interface ReviewWithCommentsInterface extends Review {
  reply: any[];
}
