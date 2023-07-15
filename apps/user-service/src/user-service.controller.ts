import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';

@Controller('user')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.userServiceService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() request: any): Promise<any> {
    const userId = request.user.sub.user_id;
    const user = await this.userServiceService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id : ${userId} not found`);
    }

    return user;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userServiceService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userServiceService.remove(+id);
  }

  @MessagePattern({ role: 'user', cmd: 'create' })
  async createUser(data: any): Promise<any> {
    return await this.userServiceService.create(data);
  }

  @MessagePattern({ role: 'user', cmd: 'login' })
  async loginControl(data: any): Promise<any> {
    return await this.userServiceService.loginControl(data);
  }
}
