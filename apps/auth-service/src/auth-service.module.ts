import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerMiddleware } from '../middleware/logger.middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4010,
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthServiceController],
  providers: [AuthService],
})
export class AuthServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
