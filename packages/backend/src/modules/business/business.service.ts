import { HttpException, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { BusinessRepository } from './repository/business.repository';
import { BusinessConstant } from '../../common/constants/business.constant';
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
import { HttpService } from '@nestjs/axios';
import { AxiosService } from '../axios/axios.service';
import { buildQueryParams, validateRoad } from 'src/common/utils';
import { BusinessStatusEnum } from 'src/common/enums';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userService: UserService,
    private readonly axiosService: AxiosService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOneById(id);

    return business;
  }

  async getAllByCurrentUser(user: User): Promise<FindAllResponse<Business>> {
    const businesses = await this.businessRepository.findAll({
      _id: { $in: user.businesses },
    });

    return businesses;
  }

  async create(
    createBusinessDto: CreateBusinessDto,
    userId: string,
  ): Promise<Business> {
    // Validate open time and close time
    const { dayOfWeek } = createBusinessDto;
    for (const day of dayOfWeek) {
      if (
        !RegExp(BusinessConstant.regexOpenCloseTime).test(day.openTime) ||
        !RegExp(BusinessConstant.regexOpenCloseTime).test(day.closeTime)
      ) {
        throw new HttpException(
          {
            message: ERRORS_DICTIONARY.INVALID_INPUT,
            detail:
              'Open time and close time must be in format HH:MM or HH must be 00 to 23 or MM must be one of 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
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
            detail: 'Open time must be before close time',
          },
          ERROR_CODES[ERRORS_DICTIONARY.INVALID_INPUT],
        );
      }
    }

    // Format if not true form of HH or MM from 0 to 00, 1 to 01, 2 to 02,...
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

    // validate addresses in Vietnam
    const osmApi = 'https://nominatim.openstreetmap.org/search.php';

    const { country, province, district, addressLine } = createBusinessDto;

    const addresses = {
      street: addressLine,
      county: district,
      province,
      country: country,
    };

    const queryStr = buildQueryParams(addresses);

    const data = await this.axiosService.get(osmApi + queryStr);

    const roads = data.map((item) => item.address.road);

    const components = addressLine.split(' ');

    const road = components.slice(1).join(' ');

    if (!validateRoad(road, roads)) {
      throw new HttpException(
        {
          message: ERRORS_DICTIONARY.INVALID_INPUT,
          detail: 'Invalid road address',
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

  async softDelete(id: string): Promise<boolean> {
    const business = await this.businessRepository.findOneById(id);

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

  async forceDelete(userId: string, businessId: string): Promise<boolean> {
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

      await this.userService.removeBusiness(userId, businessId);

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
    // const business = await this.businessRepository.restore(id);

    return false;
  }
}
