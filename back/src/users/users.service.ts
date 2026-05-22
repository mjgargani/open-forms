import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashedPassword }
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, user: true, email: true, name: true, role: true, active: true }
    });
  }

  findOne(user: string) {
    return this.prisma.user.findUnique({
      where: { user }
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
