import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Business } from '../entities/business.entity';

export class BusinessRepository extends BaseRepositoryAbstract<Business> {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {
    super(businessModel);
  }
}
