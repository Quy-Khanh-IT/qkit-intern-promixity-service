import { HttpException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';
import {
  ERRORS_DICTIONARY,
  ERROR_CODES,
} from 'src/common/constants/error.constant';
import { User } from '../user/entities/user.entity';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import { transObjectIdToString } from 'src/common/utils';
import { AxiosService } from '../axios/axios.service';
import {
  BusinessStatusEnum,
  GetBusinessesByStatusEnum,
  StatusActionsEnum,
  AvailableActions,
} from 'src/common/enums';
import { ConfigService } from '@nestjs/config';
import { ExtendedActionResponse } from './types/availableActionResponse.type';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Types } from 'mongoose';
import { NominatimOsmService } from '../nominatim-osm/nominatim-osm.service';
import { ValidateAddress } from './dto/validate-address.dto';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly axiosService: AxiosService,
    private readonly configService: ConfigService,
    private readonly nominatimOsmService: NominatimOsmService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOneById(id);

    return business;
  }

  async getBusinessesByStatus(
    type: GetBusinessesByStatusEnum,
  ): Promise<ExtendedActionResponse<Business>> {
    if (type === GetBusinessesByStatusEnum.DELETED) {
      const businesses = await this.businessRepository.findAllWithDeleted({});

      const availableActions: string[] = [];

      const response: ExtendedActionResponse<Business> = {
        count: businesses.count,
        items: businesses.items,
        availableActions,
      };

      return response;
    }

    const businesses = await this.businessRepository.findAll({
      status: type,
    });

    const availableActions: string[] = AvailableActions[type];

    const response: ExtendedActionResponse<Business> = {
      count: businesses.count,
      items: businesses.items,
      availableActions,
    };

    return response;
  }

  async getAllByUser(user: User): Promise<FindAllResponse<Business>> {
    const businesses = await this.businessRepository.findAll({
      _id: { $in: user.businesses },
    });

    return businesses;
  }

  async create(
    createBusinessDto: CreateBusinessDto,
    userId: string,
  ): Promise<Business> {
    const { dayOfWeek } = createBusinessDto;
    // Validate open time and close time
    for (const day of dayOfWeek) {
      const startHH = parseInt(day.openTime.split(':')[0]);
      const startMM = parseInt(day.openTime.split(':')[1]);
      const endHH = parseInt(day.closeTime.split(':')[0]);
      const endMM = parseInt(day.closeTime.split(':')[1]);

      if (startHH < 0 || startHH > 23 || endHH < 0 || endHH > 23) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time and close time must be between 0 and 23',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
      if (startMM < 0 || startMM > 59 || endMM < 0 || endMM > 59) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time and close time must be between 0 and 59',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
      // opening 24H
      if (
        startHH === endHH &&
        startMM === endMM &&
        startHH === 0 &&
        startMM === 0
      ) {
        continue;
      }
      if (startHH > endHH || (startHH === endHH && startMM >= endMM)) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time must be lower close time',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
    }

    // Format HH or MM from 0 to 00, 1 to 01, 2 to 02,...
    dayOfWeek.forEach((day) => {
      day.openTime = day.openTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
      day.closeTime = day.closeTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
    });

    const { country, province, district, addressLine, latitude, longitude } =
      createBusinessDto;

    const isValid = await this.validateAddress({
      country,
      province,
      district,
      addressLine,
      latitude,
      longitude,
    });

    if (!isValid) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.INVALID_INPUT,
          detail: 'Invalid address line',
        },
        ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const business = await this.businessRepository.create(createBusinessDto);

      const businessId = transObjectIdToString(business._id);

      await this.userService.addBusiness(userId, businessId);

      await transactionSession.commitTransaction();

      return business;
    } catch (err) {
      await transactionSession.abortTransaction();
      throw err;
    } finally {
      transactionSession.endSession();
    }
  }

  async updateInformation(
    businessId: string,
    userBusinesses: Types.ObjectId[],
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Boolean> {
    // check if business belongs to user
    const found = userBusinesses.find((id) => id.toString() === businessId);

    if (!found) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
          detail: 'Business is not belong to user',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      );
    }

    return !!(await this.businessRepository.update(
      businessId,
      updateBusinessDto,
    ));
  }

  async updateAddresses(
    businessId: string,
    userBusinesses: Types.ObjectId[],
    updateAddressDto: UpdateAddressDto,
  ): Promise<Business> {
    // check if business belongs to user
    const found = userBusinesses.find((id) => id.toString() === businessId);

    if (!found) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
          detail: 'Business is not belong to user',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      );
    }

    const business = await this.businessRepository.findOneById(businessId);

    if (business.status === BusinessStatusEnum.PENDING) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.INVALID_INPUT,
          detail: 'Cannot delete "pending" business',
        },
        ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
      );
    }

    const isDeleted = await this.businessRepository.softDelete(id);

    return isDeleted;
  }

  async updateImages(
    businessId: string,
    userBusinesses: Types.ObjectId[],
    updateAddressDto: UpdateAddressDto,
  ): Promise<Business> {
    // check if business belongs to user
    const found = userBusinesses.find((id) => id.toString() === businessId);

    if (!found) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
          detail: 'Business is not belong to user',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      );
    }

    const business = await this.businessRepository.findOneById(businessId);

    return business;
  }

  async softDelete(businessId: string, user: User): Promise<boolean> {
    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
          detail: 'Business not found',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      );
    }

    // Check if business belong to user
    const found = user.businesses.find((id) => id.toString() === businessId);

    if (!found) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
          detail: 'Cannot delete business that does not belong to you',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
      );
    }

    const isDeleted = await this.businessRepository.softDelete(businessId);

    return isDeleted;
  }

  async forceDelete(businessId: string, user: User): Promise<boolean> {
    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_NOT_FOUND,
          detail: 'Business not found',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_NOT_FOUND],
      );
    }

    // Check if business is already deleted
    if (business.deleted_at === null) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
          detail: 'Cannot delete business',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
      );
    }

    // Check if business belong to user
    const found = user.businesses.find((id) => id.toString() === businessId);

    if (!found) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
          detail: 'Cannot delete business that does not belong to you',
        },
        ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
      );
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const business = await this.businessRepository.findOneById(businessId);

      if (business.deletedAt === null) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.BUSINESS_FORBIDDEN,
            detail: 'Cannot delete "pending" business',
          },
          ERROR_CODES[ERRORS_DICTIONARY.BUSINESS_FORBIDDEN],
        );
      }

      const deleteBusiness =
        await this.businessRepository.hardDelete(businessId);

      await this.userService.removeBusiness(user.id, businessId);

      await transactionSession.commitTransaction();

      return deleteBusiness;
    } catch (err) {
      await transactionSession.abortTransaction();

      throw err;
    } finally {
      transactionSession.endSession();
    }
  }

  async restore(id: string): Promise<boolean> {
    return !!(await this.businessRepository.restore(id));
  }

  async handleStatus(id: string, type: StatusActionsEnum): Promise<boolean> {
    // Check exist business
    const business = await this.businessRepository.findOneById(id);

    if (!business) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.INVALID_INPUT,
          detail: 'Business not found',
        },
        ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
      );
    }

    // handle APPROVE
    if (type === StatusActionsEnum.APPROVE) {
      if (business.status !== BusinessStatusEnum.PENDING_APPROVED) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail:
              'Cannot approve business. Business must be pending approved first',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      // TODO: Add logic after ban business

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.APPROVED,
      }));
    }

    // handle REJECT
    if (type === StatusActionsEnum.REJECT) {
      if (business.status !== BusinessStatusEnum.PENDING_APPROVED) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail:
              'Cannot approve business. Business must be pending approved first',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      // TODO: Add logic after ban business

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.REJECTED,
      }));
    }

    // handle BANNED
    if (type === StatusActionsEnum.BANNED) {
      if (business.status !== BusinessStatusEnum.APPROVED) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Cannot ban business. Business must be approved first',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      // TODO: Add logic after ban business

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.BANNED,
      }));
    }

    // handle PENDING
    if (type === StatusActionsEnum.PENDING) {
      if (business.status !== BusinessStatusEnum.APPROVED) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Cannot pending business. Business must be approved first',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      // TODO: Add logic after pending a business

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.PENDING,
      }));
    }

    return false;
  }

  async validateAddress(validateAddress: ValidateAddress): Promise<Boolean> {
    const structureData = await this.nominatimOsmService.structure({
      country: validateAddress.country,
      province: validateAddress.province,
      district: validateAddress.district,
      addressLine: validateAddress.addressLine,
    });

    if (structureData.length === 0) {
      return false;
    }

    const reverseData = await this.nominatimOsmService.reverse({
      latitude: validateAddress.latitude,
      longitude: validateAddress.longitude,
    });

    let i = 1;

    for (const item of structureData) {
      console.log('i', i++);
      if (
        item?.address?.country === reverseData?.address?.country &&
        // item?.address?.state === reverseData?.address?.state &&
        item?.address?.city === reverseData?.address?.city &&
        item?.address?.suburb === reverseData?.address?.suburb &&
        item?.address?.road === reverseData?.address?.road
      ) {
        console.log('item', item);

        return true;
      }
    }

    return business;
  }
}

// address: {
//   amenity: 'Thư viện Khoa học Tổng hợp TP.HCM',
//   house_number: '69',
//   road: 'Lý Tự Trọng',
//   quarter: 'Phường Bến Thành',
//   suburb: 'Quận 1',
//   city: 'Thành phố Hồ Chí Minh',
//   'ISO3166-2-lvl4': 'VN-SG',
//   postcode: '71009',
//   country: 'Việt Nam',
//   country_code: 'vn'
// },

//// REVERSE
// address: {
//   highway: 'Lý Tự Trọng',
//   road: 'Pasteur',
//   quarter: 'Phường Bến Nghé',
//   suburb: 'Quận 1',
//   city: 'Thành phố Hồ Chí Minh',
//   'ISO3166-2-lvl4': 'VN-SG',
//   postcode: '71006',
//   country: 'Việt Nam',
//   country_code: 'vn'
// },

// address: {
//   road: 'Lý Tự Trọng',
//   quarter: 'Phường Bến Thành',
//   suburb: 'Quận 1',
//   city: 'Thành phố Hồ Chí Minh',
//   'ISO3166-2-lvl4': 'VN-SG',
//   postcode: '71009',
//   country: 'Việt Nam',
//   country_code: 'vn'
// },

// address: {
//   road: 'Lý Tự Trọng',
//   quarter: 'Phường Bến Nghé',
//   suburb: 'Quận 1',
//   city: 'Thành phố Hồ Chí Minh',
//   'ISO3166-2-lvl4': 'VN-SG',
//   postcode: '71006',
//   country: 'Việt Nam',
//   country_code: 'vn'
// },

// address: {
//   road: 'Lý Tự Trọng',
//   quarter: 'Phường Bến Nghé',
//   suburb: 'Quận 1',
//   city: 'Thành phố Hồ Chí Minh',
//   'ISO3166-2-lvl4': 'VN-SG',
//   postcode: '77000',
//   country: 'Việt Nam',
//   country_code: 'vn'
// },
