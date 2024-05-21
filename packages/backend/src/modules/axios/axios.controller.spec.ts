import { Test, TestingModule } from '@nestjs/testing';
import { AxiosController } from './axios.controller';
import { AxiosService } from './axios.service';

describe('AxiosController', () => {
  let controller: AxiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AxiosController],
      providers: [AxiosService],
    }).compile();

    controller = module.get<AxiosController>(AxiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
