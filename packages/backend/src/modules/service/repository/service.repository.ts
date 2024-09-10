import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { Service } from '../entities/service.entity';

export class ServiceRepository extends BaseRepositoryAbstract<Service> {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
  ) {
    super(serviceModel);
  }
}
