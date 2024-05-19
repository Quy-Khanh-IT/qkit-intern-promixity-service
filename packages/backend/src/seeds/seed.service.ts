import { Injectable, Logger } from '@nestjs/common';
import { District } from 'src/modules/address/entities/district.entity';
import { DistrictRepository } from 'src/modules/address/repository/district.repository';
import { districtSeedData } from './data/district-seed.data';
import { ProvinceRepository } from 'src/modules/address/repository/province.repository';
import { provinceSeedData } from './data/province-seed.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly districtRepository: DistrictRepository,
    private readonly provinceRepository: ProvinceRepository,
  ) {}

  async seedDistricts() {
    for (const district of districtSeedData) {
      const existingDistrict = await this.districtRepository.findOneByCondition(
        { code: district.code },
      );
      if (!existingDistrict) {
        await this.districtRepository.create(district);
      } else {
      }
    }

    this.logger.log('Districts seeded successfully');
  }

  async seedProvinces() {
    for (const province of provinceSeedData) {
      const existingProvince = await this.provinceRepository.findOneByCondition(
        { code: province.code },
      );
      if (!existingProvince) {
        await this.provinceRepository.create(province);
      } else {
      }
    }

    this.logger.log('Provinces seeded successfully');
  }
}
