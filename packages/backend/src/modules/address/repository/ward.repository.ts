import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ward } from '../entities/ward.entity';

export class WardRepository extends BaseRepositoryAbstract<Ward> {
  constructor(@InjectModel(Ward.name) private readonly wardModel: Model<Ward>) {
    super(wardModel);
  }
}
