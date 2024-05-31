import { Injectable } from '@nestjs/common';
import { RegisterBusinessEvent } from '../business/events/register-business.event';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventConstant } from 'src/common/constants/event.constant';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/common/enums';
import { NotificationRepository } from './repository/notification.repository';
import { BaseNotificationDto } from './dto/base-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userService: UserService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(payload: BaseNotificationDto) {
    await this.notificationRepository.create(payload);
  }

  async findOneById(id: string) {
    return await this.notificationRepository.findOneById(id);
  }

  @OnEvent(EventConstant.REGISTER_BUSINESS)
  handleRegisterBusinessEvent(registerBusinessEvent: RegisterBusinessEvent) {
    this.create(registerBusinessEvent.payload);
  }
}
