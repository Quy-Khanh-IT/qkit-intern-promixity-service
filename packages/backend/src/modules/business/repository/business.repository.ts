import { Business } from '../entities/business.entity';
import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { transStringToObjectId } from 'src/common/utils';
import { BusinessStatusEnum } from 'src/common/enums';

export class BusinessRepository extends BaseRepositoryAbstract<Business> {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {
    super(businessModel);
  }
}
