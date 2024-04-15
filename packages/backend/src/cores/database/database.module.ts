import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // const username = configService.get('MONGO_USERNAME');
        // const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_NAME');
        const host = configService.get('MONGO_HOST');
        const port = configService.get('MONGO_PORT');
        const urlConnection = `mongodb://${host}:${port}/${database}`;

        return {
          uri: `${urlConnection}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
