import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { AxiosController } from './axios.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 7000,
    }),
  ],
  controllers: [AxiosController],
  providers: [AxiosService],
  exports: [AxiosService],
})
export class AxiosModule {}
