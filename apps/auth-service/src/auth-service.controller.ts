import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const login = await this.authService.login(loginAuthDto);
    if (!login) {
      throw new NotFoundException(
        `User with email : ${loginAuthDto.email} not found`,
      );
    } else {
      return login;
    }
  }

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const decodedPassword = registerAuthDto.password;
    const createUser = await this.authService.register(registerAuthDto);
    const loginAuthDto = new LoginAuthDto();
    loginAuthDto.email = createUser.email;
    loginAuthDto.password = decodedPassword;
    return await this.authService.login(loginAuthDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data) {
    try {
      return await this.authService.LoggedIn(data);
    } catch (e) {
      return false;
    }
  }
}
