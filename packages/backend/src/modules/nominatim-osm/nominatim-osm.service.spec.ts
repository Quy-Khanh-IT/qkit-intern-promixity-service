import { Test, TestingModule } from '@nestjs/testing';
import { NominatimOmsService } from './nominatim-osm.service';

describe('NominatimOmsService', () => {
  let service: NominatimOmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NominatimOmsService],
    }).compile();

    service = module.get<NominatimOmsService>(NominatimOmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
