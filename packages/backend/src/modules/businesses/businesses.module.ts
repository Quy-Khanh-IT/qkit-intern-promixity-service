import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule {}
