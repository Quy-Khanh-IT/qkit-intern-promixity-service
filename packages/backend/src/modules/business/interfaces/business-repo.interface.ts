import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';

import { Business } from '../entities/business.entity';

export interface BusinessRepositoryInterface
  extends BaseRepositoryInterface<Business> {
  softDeleteAndUpdate(id: string): Promise<boolean>;
}
