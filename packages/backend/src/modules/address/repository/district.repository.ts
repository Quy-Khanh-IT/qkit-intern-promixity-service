import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District } from '../entities/district.entity';

export class DistrictRepository extends BaseRepositoryAbstract<District> {
  constructor(
    @InjectModel(District.name) private readonly districtModel: Model<District>,
  ) {
    super(districtModel);
  }
}
