import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesService } from './businesses.service';

describe('BusinessesService', () => {
  let service: BusinessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessesService],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
