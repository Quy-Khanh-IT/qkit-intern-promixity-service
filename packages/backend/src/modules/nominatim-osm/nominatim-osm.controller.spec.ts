import { Test, TestingModule } from '@nestjs/testing';
import { NominatimOmsController } from './nominatim-osm.controller';
import { NominatimOsmService } from './nominatim-osm.service';

describe('NominatimOmsController', () => {
  let controller: NominatimOmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NominatimOmsController],
      providers: [NominatimOsmService],
    }).compile();

    controller = module.get<NominatimOmsController>(NominatimOmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
