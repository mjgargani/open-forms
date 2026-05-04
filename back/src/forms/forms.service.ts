import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  create(createFormDto: CreateFormDto) {
    return this.prisma.form.create({
      data: createFormDto
    });
  }

  findAll() {
    return this.prisma.form.findMany();
  }

  findOne(id: string) {
    return this.prisma.form.findUnique({
      where: { id }
    });
  }

  update(id: string, updateFormDto: UpdateFormDto) {
    return this.prisma.form.updateManyAndReturn({
      where: { id },
      data: updateFormDto
    });
  }

  remove(id: string) {
    return this.prisma.form.delete({
      where: { id }
    });
  }

  // Action-Domain - View
  exam(id: string) {
    return this.prisma.form.findFirst({ // Mudamos para findFirst por causa dos filtros booleanos
      where: { 
        id, 
        active: true, 
        published: true 
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        questions: {
          where: { active: true },
          select: {
            id: true,
            title: true,
            type: true,
            formId: true, 
            options: {
              where: { active: true },
              select: {
                id: true,
                description: true,
                type: true,
                questionId: true
              }
            }
          }
        }
      }
    });
  }
}
