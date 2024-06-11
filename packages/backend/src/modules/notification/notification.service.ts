import { Injectable } from '@nestjs/common';
import { CreateBusinessEvent } from '../business/events/create-business.event';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
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
import { EventDispatcherEnum } from 'src/common/enums/notification.enum';
import { CloseBusinessEvent } from '../business/events/close-business.event';
import { RejectBusinessEvent } from '../business/events/reject-business.event';
import { BannedBusinessEvent } from '../business/events/banned-business.event';
import {
  NotificationNotBelongException,
  NotificationNotFoundException,
} from 'src/common/exceptions/notification.exception';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/common/enums';
import { transStringToObjectId } from 'src/common/utils';

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
    user: User,
  ): Promise<PaginationResult<Notification>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/notification`;

    if (user.role === UserRole.ADMIN) {
      query.userId = null;
    } else {
      query.userId = user.id;
    }

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

    if (query.userId) {
      matchStage['receiverId'] = query.userId;
    } else {
      matchStage['receiverId'] = null;
    }

    if (query.isRead) {
      const isRead: boolean = query.isRead === 'true' ? true : false;

      matchStage['isRead'] = {
        $eq: isRead,
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

  async markAllAsRead(user: User): Promise<boolean> {
    if (user.role === UserRole.ADMIN) {
      return await this.notificationRepository.markAllAsRead(null);
    }

    return await this.notificationRepository.markAllAsRead(user.id);
  }

  async markAsRead(notificationId: string, user: User): Promise<boolean> {
    const notification = await this.notificationRepository.findOneByCondition({
      _id: notificationId,
      receiverId: user.role === UserRole.ADMIN ? null : user.id,
    });

    if (!notification) {
      throw new NotificationNotFoundException();
    }

    return !!(await this.notificationRepository.update(notificationId, {
      isRead: true,
    }));
  }

  async getUnreadCount(user: User) {
    let userId: string | null;

    if (user.role === UserRole.ADMIN) {
      userId = null;
    } else {
      userId = user.id;
    }

    const notifications = await this.notificationRepository.findAll({
      isRead: false,
      receiverId: userId,
    });

    return notifications.count;
  }

  @OnEvent(EventDispatcherEnum.CREATE_BUSINESS)
  async handleCreateBusinessEvent(createBusinessEvent: CreateBusinessEvent) {
    return this.create(createBusinessEvent.payload);
  }

  @OnEvent(EventDispatcherEnum.CLOSE_BUSINESS)
  async handleCloseBusinessEvent(closeBusinessEvent: CloseBusinessEvent) {
    return this.create(closeBusinessEvent.payload);
  }

  @OnEvent(EventDispatcherEnum.REJECT_BUSINESS)
  async handleRejectBusinessEvent(rejectBusinessEvent: RejectBusinessEvent) {
    return this.create(rejectBusinessEvent.payload);
  }

  @OnEvent(EventDispatcherEnum.BANNED_BUSINESS)
  async handleBannedBusinessEvent(bannedBusinessEvent: BannedBusinessEvent) {
    return this.create(bannedBusinessEvent.payload);
  }
}
