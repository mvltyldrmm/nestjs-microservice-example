import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '../config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4010,
    },
  });
  app.startAllMicroservices();
  await app.listen(3002);
}

bootstrap();
