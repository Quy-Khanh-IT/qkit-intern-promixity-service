import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

describe('UploadFileController', () => {
  let controller: UploadFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadFileController],
      providers: [UploadFileService],
    }).compile();

    controller = module.get<UploadFileController>(UploadFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
