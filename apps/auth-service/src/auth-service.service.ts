import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';
import { jwtConstants } from './guards/constants';
import { request } from 'express';
import { comparePasswords, encodePassword } from './utils/bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private jwtService: JwtService,
  ) {}
  async login(LoginAuthDto: LoginAuthDto) {
    const user = await this.loginUser(LoginAuthDto);

    if (user) {
      const matched = comparePasswords(LoginAuthDto.password, user.password);
      if (matched) {
        const payload = {
          sub: {
            user_id: user.id,
            email: user.email,
          },
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '48h' });
        const expiresIn = Math.floor(Date.now() / 1000) + 48 * 60 * 60;

        return {
          access_token: accessToken,
          user: payload.sub,
          expires_in: expiresIn,
        };
      } else {
        return false;
      }
    } else {
      return user;
    }
  }

  async register(registerAuthDto: RegisterAuthDto) {
    registerAuthDto.password = encodePassword(registerAuthDto.password);
    return this.createUser(registerAuthDto);
  }

  async createUser(registerAuthDto: RegisterAuthDto): Promise<any> {
    const email = registerAuthDto.email;
    const password = registerAuthDto.password;
    try {
      const user = await this.client
        .send({ role: 'user', cmd: 'create' }, { email, password })
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();

      return user;
    } catch (e) {
      throw e;
    }
  }

  async loginUser(loginAuthDto: LoginAuthDto): Promise<any> {
    const email = loginAuthDto.email;
    const password = loginAuthDto.password;
    try {
      const user = await this.client
        .send({ role: 'user', cmd: 'login' }, { email, password })
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();

      return user;
    } catch (e) {
      throw e;
    }
  }

  async LoggedIn(data) {
    const jwt = data.jwt;
    try {
      const payload = await this.jwtService.verifyAsync(jwt, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
