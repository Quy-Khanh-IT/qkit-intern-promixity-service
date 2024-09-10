import { ReviewActionEnum } from 'src/common/enums';
import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';

import { UpdateAddressDto } from '../dto/update-address.dto';
import { Business } from '../entities/business.entity';

export interface BusinessRepositoryInterface
  extends BaseRepositoryInterface<Business> {
  updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Business | null>;

  restoreBusiness(id: string): Promise<Business | null>;

  updateRating(
    id: string,
    type: ReviewActionEnum,
    star: string,
    oldStar?: string,
  ): Promise<Business | null>;

  softDeleteBusiness(id: string): Promise<boolean>;
}
