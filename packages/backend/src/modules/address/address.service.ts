import { Injectable } from '@nestjs/common';
import { ProvinceRepository } from './repository/province.repository';
import { DistrictRepository } from './repository/district.repository';
import { WardRepository } from './repository/ward.repository';
import { Province } from './entities/province.enity';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly provinceRepository: ProvinceRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly wardRepository: WardRepository,
  ) {}
  // Address
  async getAllProvinces(): Promise<{ count: number; items: Province[] }> {
    const findAllResponse = await this.provinceRepository.findAll({});

    return findAllResponse;
  }

  async getAllDistrictByProvinceCode(
    province_code: string,
  ): Promise<{ count: number; items: District[] }> {
    const findAllResponse = await this.districtRepository.findAll({
      province_code,
    });

    return findAllResponse;
  }

  async getAllWardByDistrictCode(
    district_code: string,
  ): Promise<{ count: number; items: Ward[] }> {
    const findAllResponse = await this.wardRepository.findAll({
      district_code,
    });

    return findAllResponse;
  }

  // Province CRUD
  async createProvince(provinceData: Province): Promise<Province> {
    return this.provinceRepository.create(provinceData);
  }

  async getProvinceById(id: string): Promise<Province> {
    return this.provinceRepository.findOneById(id);
  }

  async updateProvince(
    id: string,
    provinceData: Partial<Province>,
  ): Promise<Province> {
    return this.provinceRepository.update(id, provinceData);
  }

  async deleteProvince(id: string): Promise<boolean> {
    return this.provinceRepository.hardDelete(id);
  }

  // District CRUD
  async createDistrict(districtData: District): Promise<District> {
    return this.districtRepository.create(districtData);
  }

  async getDistrictById(id: string): Promise<District> {
    return this.districtRepository.findOneById(id);
  }

  async updateDistrict(
    id: string,
    districtData: Partial<District>,
  ): Promise<District> {
    return this.districtRepository.update(id, districtData);
  }

  async deleteDistrict(id: string): Promise<boolean> {
    return this.districtRepository.hardDelete(id);
  }

  // Ward CRUD
  async createWard(wardData: Ward): Promise<Ward> {
    return this.wardRepository.create(wardData);
  }

  async getWardById(id: string): Promise<Ward> {
    return this.wardRepository.findOneById(id);
  }

  async updateWard(id: string, wardData: Partial<Ward>): Promise<Ward> {
    return this.wardRepository.update(id, wardData);
  }

  async deleteWard(id: string): Promise<boolean> {
    return this.wardRepository.hardDelete(id);
  }
}
