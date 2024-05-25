import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BusinessStatusEnum,
  ReviewActionEnum,
  StarEnum,
} from 'src/common/enums';

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
  async updateRating(
    id: string,
    type: ReviewActionEnum,
    star: string,
  ): Promise<Business> {
    // update total_star, total_review, stars
    const filters = {
      _id: id,
    };

    const updates = {
      $inc: {
        total_star: type === ReviewActionEnum.CREATE ? 1 : -1,
        total_review: type === ReviewActionEnum.CREATE ? 1 : -1,
        'stars.$[element].count': type === ReviewActionEnum.CREATE ? 1 : -1,
      },
    };

    const opts = {
      arrayFilters: [{ 'element.star': StarEnum[star] }],
      new: true,
    };

    const result = await this.businessModel.findOneAndUpdate(
      filters,
      updates,
      opts,
    );

    // update rating
    const totalStars = result.stars.reduce(
      (acc, star) => acc + star.star * star.count,
      0,
    );

    const totalReviews = result.stars.reduce(
      (acc, star) => acc + star.count,
      0,
    );

    const overallRating = totalReviews > 0 ? totalStars / totalReviews : 0;

    const rating = Math.round(overallRating * 10) / 10; // round to 1 decimal place

    return await this.businessModel.findByIdAndUpdate(id, {
      overall_rating: rating,
    });
  }

  // async updateReview(id: string, type: string, star: string) {}

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
