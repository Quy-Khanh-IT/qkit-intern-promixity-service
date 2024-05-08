import { Business } from '../entities/business.entity';
import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class BusinessRepository extends BaseRepositoryAbstract<Business> {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {
    super(businessModel);
  }
}
