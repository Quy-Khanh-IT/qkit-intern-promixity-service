import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessStatusEnum } from 'src/common/enums';

import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Business } from '../entities/business.entity';
import { BusinessRepositoryInterface } from '../interfaces/business-repo.interface';

export class BusinessRepository
  extends BaseRepositoryAbstract<Business>
  implements BusinessRepositoryInterface
{
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {
    super(businessModel);
  }
  async restoreBusiness(id: string): Promise<Business> {
    const result = await this.businessModel.findOneAndUpdate(
      {
        _id: id,
        deleted_at: { $ne: null },
      },
      {
        status: BusinessStatusEnum.APPROVED,
        deleted_at: null,
      },
      { new: true },
    );

    return result;
  }

  async updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Business | null> {
    const result = await this.businessModel
      .findByIdAndUpdate(
        id,
        {
          country: updateAddressDto.country,
          province: updateAddressDto.province,
          district: updateAddressDto.district,
          address_line: updateAddressDto.addressLine,
          full_address: updateAddressDto.fullAddress,
          $set: {
            location: {
              type: 'Point',
              coordinates: updateAddressDto.location.coordinates,
            },
          },
        },
        { new: true, useFindAndModify: false },
      )
      .lean()
      .exec();

    return result;
  }
}
