import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Requests, RequestsSchema } from './entities/request.entity';
import { RequestRepository } from './repository/request.repository';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Requests.name,
        schema: RequestsSchema,
      },
    ]),
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [RequestService],
})
export class RequestModule {}
