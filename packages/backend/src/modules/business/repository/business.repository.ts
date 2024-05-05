import { Business, BusinessDocument } from '../entities/business.entity';
import {
  BaseRepositoryAbstract,
  SoftDeleteBaseRepositoryAbstract,
} from '../../../cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

export class BusinessRepository extends BaseRepositoryAbstract<Business> {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {
    super(businessModel);
  }
}

export class BusinessSoftDeleteRepository extends SoftDeleteBaseRepositoryAbstract<BusinessDocument> {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: SoftDeleteModel<BusinessDocument>,
  ) {
    super(businessModel);
  }
}
