import { Module } from '@nestjs/common';
import { NominatimOsmService } from './nominatim-osm.service';
import { NominatimOsmController } from './nominatim-osm.controller';
import { AxiosModule } from '../axios/axios.module';

@Module({
  imports: [AxiosModule],
  controllers: [NominatimOsmController],
  providers: [NominatimOsmService],
  exports: [NominatimOsmService],
})
export class NominatimOmsModule {}
