import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from './entities/province.enity';
import { ProvinceRepository } from './repository/province.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
    ]),
  ],
  providers: [ProvinceRepository],
  exports: [ProvinceRepository, MongooseModule], // Export để sử dụng ở module khác
})
export class ProvinceModule {}
