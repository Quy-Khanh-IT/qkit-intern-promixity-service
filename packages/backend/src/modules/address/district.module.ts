import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictRepository } from './repository/district.repository';
import { District, DistrictSchema } from './entities/district.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema },
    ]),
  ],
  providers: [DistrictRepository],
  exports: [DistrictRepository, MongooseModule], // Export để sử dụng ở module khác
})
export class DistrictModule {}
