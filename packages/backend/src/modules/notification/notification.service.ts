import { Injectable } from '@nestjs/common';
import { CreateBusinessEvent } from '../business/events/create-business.event';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventDispatcherEnum } from 'src/common/constants/event.constant';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/common/enums';
import { NotificationRepository } from './repository/notification.repository';
import { PaginationResult } from 'src/cores/pagination/base/pagination-result.base';
import { ConfigKey } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';
import { PaginationHelper } from 'src/common/helper';
import { plainToClass } from 'class-transformer';
import { PipelineStage } from 'mongoose';
import { Notification } from './entities/notification.entity';
import { NoDateQueryFilterBase } from 'src/cores/pagination/base/no-date-query-filter.base';
import { FindAllNotificationQuery } from './dto/find-all-notification-query';
import { createNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly notificationRepository: NotificationRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(payload: createNotificationDto) {
    await this.notificationRepository.create(payload);
  }

  async findOneById(id: string) {
    return await this.notificationRepository.findOneById(id);
  }

  async findAllNotification(
    query: FindAllNotificationQuery,
  ): Promise<PaginationResult<Notification>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/notification`;

    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.notificationRepository,
      this.configGetAllBusinessPipeLine,
    );

    const reviews = aggregateResult.data.map((review) =>
      plainToClass(Notification, review),
    );

    aggregateResult.data = reviews;

    return aggregateResult;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this.notificationRepository.markAllAsRead(userId);
  }

  async configGetAllBusinessPipeLine(
    query: FindAllNotificationQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    const finalPipeline: PipelineStage[] = [];

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query,
    );

    if (query.isRead) {
      matchStage['isRead'] = {
        $eq: query.isRead === 'true' ? true : false,
      };
    }

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

  @OnEvent(EventDispatcherEnum.CREATE_BUSINESS)
  async handleRegisterBusinessEvent(createBusinessEvent: CreateBusinessEvent) {
    console.log('createBusinessEvent: ', createBusinessEvent);
    // return this.create(registerBusinessEvent.payload);
  }
}
