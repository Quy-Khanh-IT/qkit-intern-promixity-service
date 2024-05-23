import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import {
  ERROR_CODES,
  ERRORS_DICTIONARY,
} from 'src/common/constants/error.constant';
import {
  BusinessStatusEnum,
  OrderNumberDay,
  StatusActionsEnum,
} from 'src/common/enums';
import {
  BusinessInvalidAddressException,
  BusinessNotBelongException,
  BusinessNotFoundException,
  BusinessStatusException,
} from 'src/common/exceptions/business.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';

import { NominatimOsmService } from '../nominatim-osm/nominatim-osm.service';
import { UserService } from '../user/user.service';
import { CreateBusinessDto, DayOpenCloseTime } from './dto/create-business.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { ValidateAddressDto } from './dto/validate-address.dto';
import { Business } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';

@Injectable()
export class BusinessService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly businessRepository: BusinessRepository,
    private readonly nominatimOsmService: NominatimOsmService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOneById(id);

    return business;
  }

  async getBusinessesByStatus(
    type: BusinessStatusEnum,
  ): Promise<FindAllResponse<Business>> {
    if (type === BusinessStatusEnum.DELETED) {
      const businesses = await this.businessRepository.findAllWithDeleted({});

      const availableActions: string[] = [];

      const response: FindAllResponse<Business> = {
        count: businesses.count,
        items: businesses.items,
      };

      return response;
    }

    const businesses = await this.businessRepository.findAll({
      status: type,
    });

    const availableActions: string[] = [];

    const response: FindAllResponse<Business> = {
      count: businesses.count,
      items: businesses.items,
    };

    return response;
  }

  async getAllByUser(userId: string): Promise<FindAllResponse<Business>> {
    const businesses = await this.businessRepository.findAll({
      user_id: userId,
    });

    return businesses;
  }

  async create(
    createBusinessDto: CreateBusinessDto,
    userId: string,
  ): Promise<Business> {
    // Validate open time and close time
    let { day_of_week } = createBusinessDto;

    for (const day of day_of_week) {
      const startHH = parseInt(day.openTime.split(':')[0]);
      const startMM = parseInt(day.openTime.split(':')[1]);
      const endHH = parseInt(day.closeTime.split(':')[0]);
      const endMM = parseInt(day.closeTime.split(':')[1]);

      // Validate open time and close time must be between 0 and 23
      if (startHH < 0 || startHH > 23 || endHH < 0 || endHH > 23) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail: 'Open time and close time must be between 0 and 23',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }

      // Validate open time and close time must be between 0 and 59
      if (startMM < 0 || startMM > 59 || endMM < 0 || endMM > 59) {
        throw new BusinessInvalidAddressException();
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

    // Format if not true form of HH or MM from 0 to 00, 1 to 01, 2 to 02,...
    day_of_week.forEach((day) => {
      day.openTime = day.openTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
      day.closeTime = day.closeTime
        .split(':')
        .map((time) => (time.length === 1 ? `0${time}` : time))
        .join(':');
    });

    // Assign order number for each day
    day_of_week = day_of_week.map((day) => {
      return {
        ...day,
        order: OrderNumberDay[day.day],
      };
    }) as DayOpenCloseTime[];

    // Sort day of week by order number
    day_of_week = day_of_week.sort(
      (a, b) => a.order - b.order,
    ) as DayOpenCloseTime[];

    // Assign day of week to createBusinessDto
    createBusinessDto = {
      ...createBusinessDto,
      day_of_week,
    };

    const { country, province, district, address_line, location } =
      createBusinessDto;

    // Validate address
    const isValid = await this.validateAddress({
      country,
      province,
      district,
      address_line,
      location,
    });

    if (!isValid) {
      throw new BusinessInvalidAddressException();
    }

    const business = await this.businessRepository.create({
      ...createBusinessDto,
      user_id: userId,
    });

    return business;
  }

  async updateInformation(
    businessId: string,
    userId: string,
    updateInformationDto: UpdateInformationDto,
  ): Promise<boolean> {
    // check if business belongs to user

    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    if (business.user_id.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    if (business.status !== BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException();
    }

    return !!(await this.businessRepository.update(
      businessId,
      updateInformationDto,
    ));
  }

  async updateAddresses(
    businessId: string,
    userId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Business> {
    const found_business =
      await this.businessRepository.findOneById(businessId);

    if (!found_business) {
      throw new BusinessNotFoundException();
    }

    // check if business belongs to user
    if (found_business.user_id.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    const { country, province, district, address_line, location } =
      updateAddressDto;

    const validAddress = await this.validateAddress({
      country,
      province,
      district,
      address_line,
      location,
    });

    if (!validAddress) {
      throw new BusinessInvalidAddressException();
    }

    const business = await this.businessRepository.updateAddress(
      businessId,
      updateAddressDto,
    );

    return business;
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

  async softDelete(businessId: string, userId: string): Promise<boolean> {
    const foundBusiness = await this.businessRepository.findOneById(businessId);

    if (!foundBusiness) {
      throw new BusinessNotFoundException();
    }

    if (foundBusiness.user_id.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    if (foundBusiness.status !== BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException();
    }

    await this.businessRepository.update(businessId, {
      status: BusinessStatusEnum.DELETED,
    });

    const isDeleted = await this.businessRepository.softDelete(businessId);

    return isDeleted;
  }

  async hardDelete(businessId: string, userId: string): Promise<boolean> {
    const foundBusiness = await this.businessRepository.findOneById(businessId);

    if (!foundBusiness) {
      throw new BusinessNotFoundException();
    }

    if (foundBusiness.user_id.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    // Check if business is already deleted
    if (
      foundBusiness.deleted_at === null &&
      foundBusiness.status !== BusinessStatusEnum.DELETED
    ) {
      throw new BusinessStatusException();
    }

    return !!(await this.businessRepository.hardDelete(businessId));
  }

  async restore(businessId: string): Promise<boolean> {
    const business = await this.businessRepository.findOneById(businessId);

    if (business.status !== BusinessStatusEnum.DELETED) {
      throw new BusinessStatusException();
    }

    return !!(await this.businessRepository.restoreBusiness(businessId));
  }

  async handleStatus(id: string, type: StatusActionsEnum): Promise<boolean> {
    // Check exist business
    const business = await this.businessRepository.findOneById(id);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    // handle APPROVE
    if (type === StatusActionsEnum.APPROVED) {
      if (business.status !== BusinessStatusEnum.PENDING) {
        throw new BusinessStatusException();
      }

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.APPROVED,
      }));
    }

    // handle REJECT
    if (type === StatusActionsEnum.REJECTED) {
      if (business.status !== BusinessStatusEnum.PENDING) {
        throw new BusinessStatusException();
      }

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.REJECTED,
      }));
    }

    // handle BANNED
    if (type === StatusActionsEnum.BANNED) {
      if (business.status !== BusinessStatusEnum.APPROVED) {
        throw new BusinessStatusException();
      }

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.BANNED,
      }));
    }

    // handle PENDING
    if (type === StatusActionsEnum.PENDING) {
      if (business.status !== BusinessStatusEnum.REJECTED) {
        throw new BusinessStatusException();
      }

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.PENDING,
      }));
    }

    return false;
  }

  async findNearBy(
    longitude: string,
    latitude: string,
    maxDistance: string,
  ): Promise<FindAllResponse<Business>> {
    const businesses: FindAllResponse<Business> =
      await this.businessRepository.findAll({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      });

    return businesses;
  }

  async validateAddress(
    validateAddressDto: ValidateAddressDto,
  ): Promise<boolean> {
    const { location } = validateAddressDto;

    console.log('validateAddressDto', validateAddressDto);

    const [longitude, latitude] = location.coordinates;

    const reverseData = await this.nominatimOsmService.reverse({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    if (
      !(
        (reverseData?.address?.country && validateAddressDto.country) ===
        reverseData?.address?.country
      ) &&
      !(
        (reverseData?.address?.city && validateAddressDto.province) ===
        reverseData?.address?.city
      ) &&
      !(
        (reverseData?.address?.suburb && validateAddressDto.district) ===
        reverseData?.address?.suburb
      )
    ) {
      return false;
    }

    // Check if address line is valid
    // create mark array which mark all character in road to true
    // then check if all character in address line is in mark array
    const counts = {} as Object;

    let splitReverseRoad = (reverseData?.address?.road as string).split(' ');

    if (splitReverseRoad.includes('Đường')) {
      splitReverseRoad = splitReverseRoad.filter((item) => item != 'Đường');
    }

    const reverseRoadStr = splitReverseRoad.reduce((acc, item) => {
      return acc.concat(item);
    }, '');

    splitReverseRoad = reverseRoadStr.split('');

    splitReverseRoad.forEach((element) => {
      counts[element] = 0;
    });

    let slitAddressLine = validateAddressDto.address_line.split(' ');

    if (slitAddressLine.includes('Đường')) {
      slitAddressLine = slitAddressLine.filter((item) => item != 'Đường');
    }

    const AddressLineStr = slitAddressLine.reduce((acc, item) => {
      return acc.concat(item);
    }, '');

    slitAddressLine = AddressLineStr.split('');

    for (const char of slitAddressLine) {
      if (!counts.hasOwnProperty(char)) {
        return false;
      } else {
        counts[char] += 1;
      }
    }

    for (const key in counts) {
      if (counts[key] === 0 || counts[key] > 1) {
        if (counts[key] > 1) {
          const countWord = splitReverseRoad.filter((item) => item == key);

          if (countWord.length !== counts[key]) {
            return false;
          } else {
            continue;
          }
        }

        return false;
      }
    }

    return true;
  }
}
