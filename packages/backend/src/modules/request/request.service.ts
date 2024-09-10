import { Injectable } from '@nestjs/common';
import { TypeRequests } from 'src/common/enums';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { transStringToObjectId } from 'src/common/utils';
import { CreateRequestDto } from './dto/create-request.dto';
import { Requests } from './entities/request.entity';
import { RequestRepository } from './repository/request.repository';

@Injectable()
export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async createRequest(data: CreateRequestDto): Promise<Requests> {
    return await this.requestRepository.create({
      ...data,
      expiredAt: data.expiredTime,
    });
  }

  async findOneAndReplaceWithUserId(userId: string, newRequest: Requests) {
    return await this.requestRepository.findOneWithConditionAndUpsert(
      { userId: transStringToObjectId(userId) },
      newRequest,
    );
  }

  async populateWithUserId(
    userId: string,
    type: TypeRequests,
  ): Promise<Requests> {
    const condition = { userId: transStringToObjectId(userId), type: type };
    const result = await this.requestRepository.populateWithCondition(
      condition,
      'userId',
    );
    console.log('🚀 ~ RequestService ~ result:', result);
    return result;
  }

  async findManyByUserId(
    userId: string,
    limit: number = 5,
    ascending: boolean = false,
  ): Promise<FindAllResponse<Requests>> {
    return await this.requestRepository.findAll(
      { userId: transStringToObjectId(userId) },
      {
        limit: limit,
        sort: { expiredAt: ascending ? 1 : -1 },
      },
    );
  }

  async findManyByUserIdAndType(
    userId: string,
    type: TypeRequests,
    limit: number = 5,
    ascending: boolean = false,
  ): Promise<FindAllResponse<Requests>> {
    return await this.requestRepository.findAll(
      { userId: transStringToObjectId(userId), type: type },
      {
        limit: limit,
        sort: { expiredAt: ascending ? 1 : -1 },
      },
    );
  }

  async updateRequestStatus(id: string, isUsed: boolean): Promise<Requests> {
    return await this.requestRepository.update(id, { used: isUsed });
  }
}
