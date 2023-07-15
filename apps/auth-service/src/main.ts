import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { Transport } from '@nestjs/microservices';
import { loggerConfig } from '../config/logger.config';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4000,
    },
  });
  app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
