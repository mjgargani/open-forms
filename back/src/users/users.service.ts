import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { user: string; password?: string; name: string; role?: string | Role; email?: string }) {
    if (!data.password) throw new Error("Password is required");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Convert string to Role enum if necessary
    let roleEnum: Role = Role.USER;
    if (data.role === 'ADMIN' || data.role === Role.ADMIN) {
        roleEnum = Role.ADMIN;
    }

    return this.prisma.user.create({
      data: {
          user: data.user,
          name: data.name,
          email: data.email || `${data.user}@example.com`, // Fallback for email
          role: roleEnum,
          password: hashedPassword
      }
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

  async update(id: string, data: Partial<{ user: string; password?: string; name: string; role?: string | Role; email?: string }>) {
    const updateData: any = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.role) {
        if (updateData.role === 'ADMIN' || updateData.role === Role.ADMIN) {
            updateData.role = Role.ADMIN;
        } else {
            updateData.role = Role.USER;
        }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
