import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { Requests } from '../entities/request.entity';

export class RequestRepository extends BaseRepositoryAbstract<Requests> {
  constructor(
    @InjectModel(Requests.name) private readonly requestModel: Model<Requests>,
  ) {
    super(requestModel);
  }
}
