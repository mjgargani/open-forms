import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  create(createOptionDto: CreateOptionDto) {
    return this.prisma.option.create({
      data: createOptionDto
    });
  }

  findAll() {
    return this.prisma.option.findMany();
  }

  findOne(id: string) {
    return this.prisma.option.findUnique({
      where: { id }
    });
  }

  update(id: string, updateOptionDto: UpdateOptionDto) {
    return this.prisma.option.updateManyAndReturn({
      where: { id },
      data: updateOptionDto
    });
  }

  remove(id: string) {
    return this.prisma.option.delete({
      where: { id }
    });
  }
}
