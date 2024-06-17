import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { Requests } from '../entities/request.entity';
import { BaseRequestRepositoryInterface } from './baseRequest.repository';

export class RequestRepository
  extends BaseRepositoryAbstract<Requests>
  implements BaseRequestRepositoryInterface
{
  constructor(
    @InjectModel(Requests.name) private readonly requestModel: Model<Requests>,
  ) {
    super(requestModel);
  }
  findOneWithConditionAndReplace(
    condition: object,
    newRequest: Requests,
  ): Promise<Requests> {
    throw new Error('Method not implemented.');
  }
  async findOneWithConditionAndUpsert(
    condition: object,
    newRequest: Requests,
  ): Promise<Requests> {
    const result = await this.requestModel.findOneAndUpdate(
      condition,
      newRequest,
      {
        new: true,
        upsert: true,
      },
    );
    return result;
  }
  async populateWithCondition(
    condition = {},
    fieldName: string,
  ): Promise<Requests> {
    return await this.requestModel
      .findOne({ ...condition })
      .populate(fieldName)
      .lean();
  }
}
