import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { PipelineStage, Types } from 'mongoose';
import { ConfigKey, UploadFileConstraint } from 'src/common/constants';
import {
  ERROR_CODES,
  ERRORS_DICTIONARY,
} from 'src/common/constants/error.constant';
import { EventDispatcherEnum } from 'src/common/constants/event.constant';
import {
  BusinessStatusEnum,
  OrderNumberDay,
  ReviewActionEnum,
  StatusActionsEnum,
  UserRole,
} from 'src/common/enums';
import {
  BusinessInvalidAddressException,
  BusinessNotBelongException,
  BusinessNotFoundException,
  BusinessStatusException,
  BusinessUnauthorizedException,
} from 'src/common/exceptions/business.exception';
import { PaginationHelper } from 'src/common/helper';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { transStringToObjectId } from 'src/common/utils';
import { PaginationResult } from 'src/cores/pagination/base/pagination-result.base';

import { CategoryService } from '../category/category.service';
import { NominatimOsmService } from '../nominatim-osm/nominatim-osm.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateBusinessDto, DayOpenCloseTime } from './dto/create-business.dto';
import { FindAllBusinessQuery } from './dto/find-all-business-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { ValidateAddressDto } from './dto/validate-address.dto';
import { Business } from './entities/business.entity';
import { CreateBusinessEvent } from './events/create-business.event';
import { BusinessRepository } from './repository/business.repository';

@Injectable()
export class BusinessService {
  constructor(
    private readonly userService: UserService,
    private readonly ServiceService: ServiceService,
    private readonly categoryService: CategoryService,
    private readonly uploadFileService: UploadFileService,
    private readonly businessRepository: BusinessRepository,
    private readonly nominatimOsmService: NominatimOsmService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(
    query: FindAllBusinessQuery,
  ): Promise<PaginationResult<Business>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/businesses`;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.businessRepository,
      this.configGetAllBusinessPipeLine,
    );

    const businesses = aggregateResult.data.map((business) =>
      plainToClass(Business, business),
    );

    aggregateResult.data = businesses;

    return aggregateResult;
  }

  async configGetAllBusinessPipeLine(
    query: FindAllBusinessQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.name) {
      matchStage['name'] = { $regex: query.name, $options: 'i' };
    }

    if (query.district) {
      matchStage['district'] = { $regex: query.district, $options: 'i' };
    }

    if (query.province) {
      matchStage['province'] = { $regex: query.province, $options: 'i' };
    }

    if (query.status) {
      matchStage['status'] = query.status;
    }

    if (query.phoneNumber) {
      matchStage['phoneNumber'] = { $regex: query.phoneNumber, $options: 'i' };
    }

    if (query.categoryId) {
      matchStage['category._id'] = transStringToObjectId(query.categoryId);
    }

    if (query.starsRating && query.starsRating.length > 0) {
      const arrFilter = [];
      Array.from(query.starsRating).forEach((star) => {
        arrFilter.push({
          overallRating: {
            $gte: parseInt(star),
            $lte: parseInt(star) + 0.9,
          },
        });
      });

      finalPipeline.push({
        $match: {
          $or: [...arrFilter],
        },
      });
    }

    if (query.dayOfWeek && query.dayOfWeek.length > 0) {
      const days = JSON.parse(query.dayOfWeek) as DayOpenCloseTime[];

      days.forEach((day) => {
        finalPipeline.push({
          $match: {
            dayOfWeek: {
              $elemMatch: {
                day: day.day.toLowerCase(),
                openTime: day.openTime,
                closeTime: day.closeTime,
              },
            },
          },
        });
      });
    }

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query,
    );

    matchStage = result.matchStage;
    sortStage = result.sortStage;

    if (Object.keys(matchStage).length > 0) {
      finalPipeline.push({ $match: matchStage });
    }

    if (Object.keys(sortStage).length > 0) {
      finalPipeline.push({ $sort: sortStage });
    }

    return finalPipeline;
  }

  async findOneById(id: string): Promise<Business> {
    const business = await this.businessRepository.findOneById(id);

    return business;
  }

  getStatus(): BusinessStatusEnum[] {
    return Object.values(BusinessStatusEnum);
  }

  async getAllByUser(userId: string): Promise<FindAllResponse<Business>> {
    const businesses = await this.businessRepository.findAll({
      userId: transStringToObjectId(userId),
    });

    return businesses;
  }

  async create(
    createBusinessDto: CreateBusinessDto,
    user: User,
  ): Promise<Business> {
    // Validate open time and close time
    let { dayOfWeek } = createBusinessDto;

    for (const day of dayOfWeek) {
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

    // Validate address
    const { country, province, district, addressLine, location } =
      createBusinessDto;

    const isValid = await this.validateAddress({
      country,
      province,
      district,
      addressLine,
      location,
    });

    if (!isValid) {
      throw new BusinessInvalidAddressException();
    }

    // Assign order number for each day
    dayOfWeek = dayOfWeek.map((day) => {
      return {
        ...day,
        order: OrderNumberDay[day.day],
      };
    }) as DayOpenCloseTime[];

    // Sort day of week by order number
    dayOfWeek = dayOfWeek.sort(
      (a, b) => a.order - b.order,
    ) as DayOpenCloseTime[];

    const services = await this.ServiceService.findServices(
      createBusinessDto.serviceIds,
    );

    const category = await this.categoryService.findOneById(
      createBusinessDto.categoryId,
    );

    const business = await this.businessRepository.create({
      ...createBusinessDto,
      services: services.items.sort((a, b) => a.order - b.order),
      category,
      dayOfWeek,
      userId: user._id,
    });

    if (business) {
      this.eventEmitter.emit(
        EventDispatcherEnum.CREATE_BUSINESS,
        new CreateBusinessEvent({
          senderId: user.id,
          receiverId: null, // "null" to send to admin
        }),
      );
    }

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

    if (business.userId.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    if (business.status !== BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException();
    }

    let responseService = [];

    if (updateInformationDto.serviceIds.length) {
      const services = await this.ServiceService.findServices(
        updateInformationDto.serviceIds,
      );

      responseService = services.items
        .map((service) => {
          return {
            id: service._id,
            name: service.name,
            order: service.order,
          };
        })
        .sort((a, b) => a.order - b.order);
    }

    let category = null;

    if (updateInformationDto.categoryId) {
      category = await this.categoryService.findOneById(
        updateInformationDto.categoryId,
      );
    }

    return !!(await this.businessRepository.update(businessId, {
      ...updateInformationDto,
      services: responseService.length ? responseService : business.services,
      category: category ? category : business.category,
    }));
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
    if (found_business.userId.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    const { country, province, district, addressLine, location } =
      updateAddressDto;

    const validAddress = await this.validateAddress({
      country,
      province,
      district,
      addressLine,
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

  // case 1:
  // when user create business, while business is pending, user can delete
  // case 2:
  // when business is approved, user can't delete, only admin can delete (user can send a request to admin to delete)
  async softDelete(businessId: string, user: User): Promise<boolean> {
    console.log('softDelete businessId: ', businessId);
    const foundBusiness = await this.businessRepository.findOneById(businessId);

    if (!foundBusiness) {
      throw new BusinessNotFoundException();
    }

    // Check business status
    // case 1: If user is "ADMIN": can force delete any business
    if (user.role === UserRole.ADMIN) {
      return await this.businessRepository.softDeleteBusiness(businessId);
    }

    // case 2: If user is "BUSINESS": request to delete business
    // check if business belongs to user
    if (foundBusiness.userId.toString() !== user.id) {
      throw new BusinessNotBelongException();
    }

    if (foundBusiness.status === BusinessStatusEnum.PENDING) {
      return await this.businessRepository.softDeleteBusiness(businessId);
    }

    if (foundBusiness.status === BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException(
        'Can not delete business. Please contact admin to close business',
      );
    }
  }

  // Only admin can hard delete
  async hardDelete(businessId: string, user: User): Promise<boolean> {
    const role = user.role;

    if (role !== UserRole.ADMIN) {
      throw new BusinessUnauthorizedException();
    }

    const foundBusiness =
      await this.businessRepository.findOneByConditionWithDeleted({
        _id: transStringToObjectId(businessId),
      });

    if (!foundBusiness) {
      throw new BusinessNotFoundException();
    }

    // Check if business is already soft deleted
    if (foundBusiness.status !== BusinessStatusEnum.CLOSED) {
      throw new BusinessStatusException(
        "Can't hard delete business. Must be soft deleted first.",
      );
    }

    return await this.businessRepository.hardDelete(businessId);
  }

  async restore(businessId: string, user: User): Promise<boolean> {
    const business =
      await this.businessRepository.findOneByConditionWithDeleted({
        _id: transStringToObjectId(businessId),
      });

    if (business.status !== BusinessStatusEnum.CLOSED) {
      throw new BusinessStatusException('Business must be closed first.');
    }

    if (user.role === UserRole.ADMIN) {
      return !!(await this.businessRepository.restoreBusiness(businessId));
    }

    if (business.userId.toString() !== user.id) {
      throw new BusinessNotBelongException();
    }

    return !!(await this.businessRepository.restoreBusiness(businessId));
  }

  async restoreRequest(businessId: string): Promise<boolean> {
    return true;
  }

  async handleStatus(id: string, type: StatusActionsEnum): Promise<boolean> {
    const business = await this.businessRepository.findOneById(id);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    // handle APPROVE
    if (type === StatusActionsEnum.APPROVED) {
      if (business.status !== BusinessStatusEnum.PENDING) {
        throw new BusinessStatusException(
          "Can't approve business. Must be pending first.",
        );
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
    // BANNED business with any business status
    if (type === StatusActionsEnum.BANNED) {
      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.BANNED,
      }));
    }

    // handle PENDING
    if (type === StatusActionsEnum.PENDING) {
      if (business.status !== BusinessStatusEnum.REJECTED) {
        throw new BusinessStatusException(
          'This action is only for rejected business, user has already updated and want to register again.',
        );
      }

      return !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.PENDING,
      }));
    }

    return false;
  }

  async updateImage(
    businessId: string,
    userId: string,
    images: Express.Multer.File[],
  ): Promise<boolean> {
    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    if (business.userId.toString() !== userId) {
      throw new BusinessNotBelongException();
    }

    const imageUrls = [];

    for (const image of images) {
      let fileBuffer = image.buffer;
      if (image.size > UploadFileConstraint.LIMIT_FILE_SIZE) {
        fileBuffer = await this.uploadFileService.compressImage(fileBuffer);
      }

      const md5 = await this.uploadFileService.calculateMD5Hash(fileBuffer);

      const md5Arr = business.images.map((img) => {
        return img.etag;
      });

      if (md5Arr.includes(md5)) {
        continue;
      } else {
        const img = await this.uploadFileService.uploadImageToCloudinary(image);

        imageUrls.push({
          url: img.secure_url,
          public_id: img.public_id,
          etag: md5,
          phash: img.phash,
        });
      }
    }

    if (imageUrls.length === 0) {
      return true;
    }

    const updateImgsBusiness = await this.businessRepository.update(
      businessId,
      {
        images: imageUrls,
      },
    );

    return !!updateImgsBusiness;
  }

  async updateRating(
    businessId: string,
    type: ReviewActionEnum,
    star: string,
    oldStar?: string,
  ): Promise<Business> {
    const business = await this.businessRepository.updateRating(
      businessId,
      type,
      star,
      oldStar,
    );

    return business;
  }

  async validateAddress(
    validateAddressDto: ValidateAddressDto,
  ): Promise<boolean> {
    const { location } = validateAddressDto;

    const [longitude, latitude] = location.coordinates;

    const reverseData = await this.nominatimOsmService.reverse({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    if (reverseData?.state === validateAddressDto.province) {
      // is a province (example: tỉnh Bình Dương)
      if (
        !(reverseData?.address?.county && validateAddressDto.district) ===
          reverseData?.address?.county &&
        !(reverseData?.address?.city && validateAddressDto.district) ===
          reverseData?.address?.city &&
        !(reverseData?.address?.state && validateAddressDto.province) ===
          reverseData?.address?.state
      ) {
        return false;
      }
    } else if (
      // is a city (example: Thành phố Hồ Chí Minh)
      !(
        (reverseData?.address?.country && validateAddressDto.country) ===
        reverseData?.address?.country
      ) &&
      !(
        (reverseData?.address?.suburb && validateAddressDto.district) ===
        reverseData?.address?.suburb
      ) &&
      !(
        (reverseData?.address?.city && validateAddressDto.province) ===
        reverseData?.address?.city
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

    let slitAddressLine = validateAddressDto.addressLine.split(' ');

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

// "address": {
//   "amenity": "Trường Đại học Y Khoa Phạm Ngọc Thạch",
//   "house_number": "2",
//   "road": "Dương Quang Trung",
//   "quarter": "Phường 12",
//   "suburb": "Quận 10",
//   "city": "Thành phố Hồ Chí Minh",
//   "ISO3166-2-lvl4": "VN-SG",
//   "postcode": "72000",
//   "country": "Việt Nam",
//   "country_code": "vn"
// },

// "address": {
//   "road": "Đường Tô Vĩnh Diện",
//   "suburb": "Phường Đông Hòa",
//   "city": "Dĩ An",
//   "county": "Dĩ An",
//   "state": "Tỉnh Bình Dương",
//   "ISO3166-2-lvl4": "VN-57",
//   "postcode": "00848",
//   "country": "Việt Nam",
//   "country_code": "vn"
// },
