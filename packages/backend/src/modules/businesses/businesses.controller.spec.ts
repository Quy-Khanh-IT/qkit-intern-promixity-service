import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

describe('BusinessesController', () => {
  let controller: BusinessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessesController],
      providers: [BusinessesService],
    }).compile();

    controller = module.get<BusinessesController>(BusinessesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
