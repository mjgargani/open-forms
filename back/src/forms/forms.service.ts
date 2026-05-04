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
    return this.prisma.form.findUnique({
      where: { 
        id, 
        active: true, // `active: true` que não estão sinalizados para remoção
        published: true // `published: true` que é publicado
      }, 
      include: {
        questions: {
          where: { active: true },
          include: { 
            options: {
              where: { active: true },
              select: {
                id: true,
                description: true,
                type: true,
                questionId: true,
              }
            }
          }
        }
      }
    });
  }
}
