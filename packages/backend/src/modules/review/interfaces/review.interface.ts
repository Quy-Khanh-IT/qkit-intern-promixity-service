import { Business } from 'src/modules/business/entities/business.entity';
import { Review } from '../entities/review.entity';
import { Exclude } from 'class-transformer';

export interface ReviewWithCommentsAndBusinessInterface extends Review {
  business: Business;
  reply: any[];
}
