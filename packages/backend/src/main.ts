import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './cores/configs/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configCloudinary } from './cores/configs/cloudinary.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  configSwagger(app);
  configCloudinary(configService);

  await app.listen(port);
}
bootstrap();
