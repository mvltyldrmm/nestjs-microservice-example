import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserServiceService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async loginControl(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      select: {
        email: true,
        id: true,
        password: true,
      },
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      return user;
    } else {
      return false;
    }
  }
}
