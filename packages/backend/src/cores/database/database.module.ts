import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/common/constraints/configKey.constraint';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // const username = configService.get('MONGO_USERNAME');
        // const password = configService.get('MONGO_PASSWORD');
        //--- Above atrributes are only used in mongo atlas, local dont use account
        const database = configService.get(ConfigKey.MONGO_NAME);
        const host = configService.get(ConfigKey.MONGO_HOST);
        const port = configService.get(ConfigKey.MONGO_PORT);
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
