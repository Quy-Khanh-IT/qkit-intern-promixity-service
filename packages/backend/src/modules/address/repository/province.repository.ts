import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Province } from '../entities/province.enity';

export class ProvinceRepository extends BaseRepositoryAbstract<Province> {
  constructor(
    @InjectModel(Province.name) private readonly provinceModel: Model<Province>,
  ) {
    super(provinceModel);
  }
}
