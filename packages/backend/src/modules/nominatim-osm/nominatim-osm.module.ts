import { Module } from '@nestjs/common';
import { NominatimOsmService } from './nominatim-osm.service';
import { NominatimOmsController } from './nominatim-osm.controller';
import { AxiosModule } from '../axios/axios.module';
import { AxiosService } from '../axios/axios.service';

@Module({
  imports: [AxiosModule],
  controllers: [NominatimOmsController],
  providers: [NominatimOsmService],
  exports: [NominatimOsmService],
})
export class NominatimOmsModule {}
