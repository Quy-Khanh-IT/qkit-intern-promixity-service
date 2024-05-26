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
    oldStar?: string,
  ): Promise<Business> {
    if (parseInt(star)) {
      switch (parseInt(star)) {
        case 1:
          star = 'ONE';
          break;
        case 2:
          star = 'TWO';
          break;
        case 3:
          star = 'THREE';
          break;
        case 4:
          star = 'FOUR';
          break;
        case 5:
          star = 'FIVE';
          break;
      }
    }

    if (oldStar && parseInt(oldStar)) {
      switch (parseInt(oldStar)) {
        case 1:
          oldStar = 'ONE';
          break;
        case 2:
          oldStar = 'TWO';
          break;
        case 3:
          oldStar = 'THREE';
          break;
        case 4:
          oldStar = 'FOUR';
          break;
        case 5:
          oldStar = 'FIVE';
          break;
      }
    }

    // If "EDIT" action, we need to find the old star and decrease the count
    if (type === ReviewActionEnum.EDIT && oldStar) {
      const decreaseOldStar = {
        $inc: {
          'stars.$[element].count': -1,
        },
      };

      const opts = {
        arrayFilters: [{ 'element.star': StarEnum[oldStar] }],
        new: true,
      };

      await this.businessModel.findOneAndUpdate(
        {
          _id: id,
          'stars.star': StarEnum[oldStar],
        },
        decreaseOldStar,
        opts,
      );
    }

    // update total_star, total_review, stars
    let updates = {};

    switch (type) {
      case ReviewActionEnum.CREATE:
        updates = {
          $inc: {
            total_review: 1,
            'stars.$[element].count': 1,
          },
        };
        break;
      case ReviewActionEnum.DELETE:
        updates = {
          $inc: {
            total_review: -1,
            'stars.$[element].count': -1,
          },
        };
        break;
      case ReviewActionEnum.EDIT:
        updates = {
          $inc: {
            'stars.$[element].count': 1,
          },
        };
        break;
    }

    const filters: any = {
      _id: id,
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

    const overallRating =
      result.total_review > 0 ? totalStars / result.total_review : 0;

    return await this.businessModel.findByIdAndUpdate(id, {
      overall_rating: overallRating.toFixed(2),
    });
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
