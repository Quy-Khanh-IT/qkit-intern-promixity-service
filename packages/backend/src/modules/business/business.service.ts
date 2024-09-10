import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { PipelineStage, Types } from 'mongoose';
import { ConfigKey, UploadFileConstraint } from 'src/common/constants';
import {
  ERROR_CODES,
  ERRORS_DICTIONARY,
} from 'src/common/constants/error.constant';
import {
  BusinessStatusEnum,
  OrderNumberDay,
  ReviewActionEnum,
  StatusActionsEnum,
  UserRole,
} from 'src/common/enums';
import {
  EventDispatcherEnum,
  NotificationResourceEnum,
} from 'src/common/enums/notification.enum';
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
import { ReviewService } from '../review/review.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { FindAllUserBusinessQuery } from '../user/dto/find-all-user-business.query.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateBusinessDto, DayOpenCloseTime } from './dto/create-business.dto';
import { FindAllBusinessQuery } from './dto/find-all-business-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { ValidateAddressDto } from './dto/validate-address.dto';
import { Business } from './entities/business.entity';
import { BannedBusinessEvent } from './events/banned-business.event';
import { CloseBusinessEvent } from './events/close-business.event';
import { CreateBusinessEvent } from './events/create-business.event';
import { RejectBusinessEvent } from './events/reject-business.event';
import { RestoreBusinessEvent } from './events/restore-business.event';
import { BusinessRepository } from './repository/business.repository';
import { ServiceService } from '../service/service.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly userService: UserService,
    private readonly ServiceService: ServiceService,
    private readonly categoryService: CategoryService,
    private readonly uploadFileService: UploadFileService,
    private readonly businessRepository: BusinessRepository,
    private readonly nominatimOsmService: NominatimOsmService,
    @Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService,
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

    if (query.address) {
      matchStage['addressLine'] = { $regex: query.address, $options: 'i' };
    }

    if (query.status && query.status.length > 0) {
      let arr = [];

      if (!Array.isArray(query.status)) {
        arr.push(query.status);
      } else {
        arr = query.status;
      }

      matchStage['status'] = {
        $in: arr,
      };
    }

    if (query.phoneNumber) {
      matchStage['phoneNumber'] = { $regex: query.phoneNumber, $options: 'i' };
    }

    if (query.categoryIds && query.categoryIds.length > 0) {
      let arr = [];

      if (!Array.isArray(query.categoryIds)) {
        arr.push(query.categoryIds);
      } else {
        arr = query.categoryIds;
      }

      matchStage['category._id'] = {
        $in: arr.map((id) => transStringToObjectId(id)),
      };
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

    if (query.sortRatingBy) {
      sortStage['overallRating'] = query.sortRatingBy === 'asc' ? 1 : -1;
    }

    if (query.sortTotalReviewsBy) {
      sortStage['totalReview'] = query.sortTotalReviewsBy === 'asc' ? 1 : -1;
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

    return plainToClass(Business, business);
  }

  getStatus(): BusinessStatusEnum[] {
    return Object.values(BusinessStatusEnum);
  }

  getActions(): StatusActionsEnum[] {
    return Object.values(StatusActionsEnum);
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

    console.log('isValid', isValid);

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
      if (user.role === UserRole.USER) {
        await this.userService.decentralizeToBusiness(user.id);
      }

      this.eventEmitter.emit(
        EventDispatcherEnum.CREATE_BUSINESS,
        new CreateBusinessEvent({
          content: `User '${user.firstName} ${user.lastName}' has registered a new business '${business.name}' (id: ${business._id}). Please check and approve it.`,
          senderId: user.id,
          receiverId: null, // "null" to send to admin
          // resource: NotificationResourceEnum.BUSINESS,
        }),
      );
    }

    return plainToClass(Business, business);
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
    const foundBusiness = await this.businessRepository.findOneById(businessId);

    if (!foundBusiness) {
      throw new BusinessNotFoundException();
    }

    // Check business status
    // case 1: If user is "ADMIN": can force delete any business
    if (user.role === UserRole.ADMIN) {
      return await this.businessRepository.softDelete(businessId);
    }

    // case 2: If user is "BUSINESS": request to delete business
    // check if business belongs to user
    if (foundBusiness.userId.toString() !== user.id) {
      throw new BusinessNotBelongException();
    }

    // check status of business
    if (foundBusiness.status === BusinessStatusEnum.PENDING) {
      return await this.businessRepository.softDelete(businessId);
    }

    if (foundBusiness.status === BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException(
        'Can not delete business. Please contact admin to delete business',
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
    if (foundBusiness.deleted_at === null) {
      throw new BusinessStatusException(
        "Can't hard delete business. Must be soft deleted first.",
      );
    }

    return await this.businessRepository.hardDelete(businessId);
  }

  async requestDelete(businessId: string, user: User) {
    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    if (user.id !== business.userId.toString()) {
      throw new BusinessNotBelongException();
    }

    if (business.status !== BusinessStatusEnum.APPROVED) {
      throw new BusinessStatusException();
    }

    // this.eventEmitter.emit(
    //   EventDispatcherEnum.CLOSE_BUSINESS,
    //   new CloseBusinessEvent({
    //     content: `User has requested to delete business '${business.name}' (id: ${business.id}). Please check and approve it.`,
    //     senderId: user.id,
    //     receiverId: null,
    //   }),
    // );

    return true;
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
    const business = await this.businessRepository.findOneById(businessId);

    if (!business) {
      throw new BusinessNotFoundException();
    }

    if (business.deleted_at === null) {
      throw new BusinessStatusException('Business is not deleted');
    }

    // this.eventEmitter.emit(
    //   EventDispatcherEnum.RESTORE_BUSINESS,
    //   new RestoreBusinessEvent({
    //     content: `User has requested to restore business '${business.name}' (id: ${business.id}). Please check and approve it.`,
    //     senderId: business.userId.toString(),
    //     receiverId: null,
    //   }),
    // );

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

      const result: boolean = !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.APPROVED,
      }));

      // this.eventEmitter.emit(
      //   EventDispatcherEnum.CREATE_BUSINESS,
      //   new CreateBusinessEvent({
      //     title: 'Business Approved',
      //     content: `Your business '${business.name}' has been approved. Congratulations!`,
      //     senderId: null,
      //     receiverId: business.userId.toString(),
      //   }),
      // );

      return result;
    }

    // handle REJECT
    if (type === StatusActionsEnum.REJECTED) {
      if (business.status !== BusinessStatusEnum.PENDING) {
        throw new BusinessStatusException();
      }

      const result: boolean = !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.REJECTED,
      }));

      // this.eventEmitter.emit(
      //   EventDispatcherEnum.REJECT_BUSINESS,
      //   new RejectBusinessEvent({
      //     content: `Your business '${business.name}' has been rejected. Please update your business again.`,
      //     senderId: null,
      //     receiverId: business.userId.toString(),
      //   }),
      // );

      return result;
    }

    // handle BANNED
    // BANNED business with any business status
    if (type === StatusActionsEnum.BANNED) {
      const result: boolean = !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.BANNED,
      }));

      // this.eventEmitter.emit(
      //   EventDispatcherEnum.BANNED_BUSINESS,
      //   new BannedBusinessEvent({
      //     content: `Your business '${business.name}' has been banned. Please contact admin for more information.`,
      //     senderId: null,
      //     receiverId: business.id,
      //   }),
      // );

      return result;
    }

    // handle CLOSED
    if (type === StatusActionsEnum.CLOSED) {
      if (business.status !== BusinessStatusEnum.APPROVED) {
        throw new BusinessStatusException(
          "Can't close business. Must be approved first.",
        );
      }

      const result: boolean = !!(await this.businessRepository.update(id, {
        status: BusinessStatusEnum.CLOSED,
      }));

      // this.eventEmitter.emit(
      //   EventDispatcherEnum.CLOSE_BUSINESS,
      //   new CloseBusinessEvent({
      //     content: `Your business "${business.name}" has been closed. If you want to restore, please contact admin.`,
      //     senderId: null,
      //     receiverId: business.id,
      //   }),
      // );

      return result;
    }

    // handle PENDING
    // if (type === StatusActionsEnum.PENDING) {
    //   if (business.status !== BusinessStatusEnum.REJECTED) {
    //     throw new BusinessStatusException(
    //       'This action is only for rejected business, user has already updated and want to register again.',
    //     );
    //   }

    //   return !!(await this.businessRepository.update(id, {
    //     status: BusinessStatusEnum.PENDING,
    //   }));
    // }

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

  getBusinessRepository(): BusinessRepository {
    return this.businessRepository;
  }

  async getUserBusinesses(
    userId: string,
    query: FindAllUserBusinessQuery,
  ): Promise<PaginationResult<Business>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/users/all/businesses`;

    query.userId = userId;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.businessRepository,
      this.configGetAllUserBusinessPipeLine,
    );
    const businesses = aggregateResult.data.map((business) =>
      plainToClass(Business, business),
    );

    aggregateResult.data = businesses;

    return aggregateResult as PaginationResult<Business>;
  }

  async configGetAllUserBusinessPipeLine(
    query: FindAllUserBusinessQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    if (query.userId) {
      matchStage['userId'] = transStringToObjectId(query.userId);
    }

    if (query.name) {
      matchStage['name'] = { $regex: query.name, $options: 'i' };
    }

    if (query.address) {
      matchStage['fullAddress'] = { $regex: query.address, $options: 'i' };
    }

    if (query.status && query.status.length > 0) {
      let arr = [];

      if (!Array.isArray(query.status)) {
        arr.push(query.status);
      } else {
        arr = query.status;
      }

      matchStage['status'] = {
        $in: arr,
      };
    }

    if (query.phoneNumber) {
      matchStage['phoneNumber'] = { $regex: query.phoneNumber, $options: 'i' };
    }

    if (query.categoryIds && query.categoryIds.length > 0) {
      let arr = [];

      if (!Array.isArray(query.categoryIds)) {
        arr.push(query.categoryIds);
      } else {
        arr = query.categoryIds;
      }

      matchStage['category._id'] = {
        $in: arr.map((id) => transStringToObjectId(id)),
      };
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

    if (query.sortRatingBy) {
      sortStage['overallRating'] = query.sortRatingBy === 'asc' ? 1 : -1;
    }

    if (query.sortTotalReviewsBy) {
      sortStage['totalReview'] = query.sortTotalReviewsBy === 'asc' ? 1 : -1;
    }
    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query as FindAllUserBusinessQuery,
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

  async validateAddress(
    validateAddressDto: ValidateAddressDto,
  ): Promise<boolean> {
    const { location } = validateAddressDto;

    const [longitude, latitude] = location.coordinates;

    const reverseData = await this.nominatimOsmService.reverse({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    // console.log('reverseData', reverseData);

    // if (reverseData?.state === validateAddressDto.province) {
    //   // is a province (example: tỉnh Bình Dương)

    //   console.log('in 1');
    //   if (
    //     !(reverseData?.address?.county && validateAddressDto.district) ===
    //       reverseData?.address?.county &&
    //     !(reverseData?.address?.city && validateAddressDto.district) ===
    //       reverseData?.address?.city &&
    //     !(reverseData?.address?.state && validateAddressDto.province) ===
    //       reverseData?.address?.state
    //   ) {
    //     return false;
    //   }
    // } else {
    //   console.log('in 2');

    //   console.log(
    //     '(reverseData?.address?.country && validateAddressDto.country)',
    //     reverseData?.address?.country && validateAddressDto.country,
    //   );

    //   console.log(
    //     (reverseData?.address?.country && validateAddressDto.country) ===
    //       reverseData?.address?.country,
    //   );

    //   console.log(
    //     '(reverseData?.address?.suburb && validateAddressDto.district)',
    //     reverseData?.address?.suburb && validateAddressDto.district,
    //   );

    //   console.log(
    //     (reverseData?.address?.suburb && validateAddressDto.district) ===
    //       reverseData?.address?.suburb,
    //   );

    //   if (
    //     (reverseData?.address?.country && validateAddressDto.country) ===
    //       reverseData?.address?.country &&
    //     (reverseData?.address?.city && validateAddressDto.province) ===
    //       reverseData?.address?.city &&
    //     (reverseData?.address?.suburb && validateAddressDto.district) ===
    //       reverseData?.address?.suburb
    //   ) {
    //     return false;
    //   }
    // }

    // Check if address line is valid
    // create mark array which mark all character in road to true
    // then check if all character in address line is in mark array
    const counts = {} as Object;

    // if(!reverseData?.address?.road) {
    //   return false;
    // }

    console.log('reverseData?.address?.road', reverseData?.address?.road);

    let splitReverseRoad = (reverseData?.address?.road as string)
      .toLocaleLowerCase()
      .split(' ');

    console.log('splitReverseRoad', splitReverseRoad);

    if (splitReverseRoad.includes('Đường')) {
      splitReverseRoad = splitReverseRoad.filter((item) => item != 'Đường');

      console.log('splitReverseRoad', splitReverseRoad);
    }

    const reverseRoadStr = splitReverseRoad.reduce((acc, item) => {
      return acc.concat(item);
    }, '');

    console.log('reverseRoadStr', reverseRoadStr);

    splitReverseRoad = reverseRoadStr.split('');

    splitReverseRoad.forEach((element) => {
      counts[element] = 0;
    });

    let slitAddressLine = validateAddressDto.addressLine
      .toLocaleLowerCase()
      .split(' ');

    console.log('slitAddressLine', slitAddressLine);

    if (slitAddressLine.includes('đường')) {
      slitAddressLine = slitAddressLine.filter((item) => item != 'đường');

      console.log('slitAddressLine', slitAddressLine);
    }

    const AddressLineStr = slitAddressLine.reduce((acc, item) => {
      return acc.concat(item);
    }, '');

    console.log('AddressLineStr', AddressLineStr);

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
