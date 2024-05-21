import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { ProvinceRepository } from './repository/province.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from './entities/province.enity';
import { DistrictRepository } from './repository/district.repository';
import { WardRepository } from './repository/ward.repository';
import { District, DistrictSchema } from './entities/district.entity';
import { Ward, WardSchema } from './entities/ward.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Province.name,
        schema: ProvinceSchema,
      },
      {
        name: District.name,
        schema: DistrictSchema,
      },
      {
        name: Ward.name,
        schema: WardSchema,
      },
    ]),
  ],
  controllers: [AddressController],
  providers: [
    AddressService,
    ProvinceRepository,
    DistrictRepository,
    WardRepository,
  ],
})
export class AddressModule {}
