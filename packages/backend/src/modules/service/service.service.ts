import { Injectable } from '@nestjs/common';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';

import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './repository/service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async getAll(): Promise<FindAllResponse<Service>> {
    return await this.serviceRepository.findAll({});
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.serviceRepository.create(createServiceDto);
  }

  async findServices(serviceIds: string[]): Promise<FindAllResponse<Service>> {
    return await this.serviceRepository.findAll({
      _id: { $in: serviceIds },
    });
  }
}
