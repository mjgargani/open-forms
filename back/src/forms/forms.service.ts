import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as Papa from 'papaparse';

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

  //CSV Export
  async exportCsv(id: string): Promise<string> {
    const form = await this.prisma.form.findUnique({
      where: { id, active: true },
      include: {
        questions: {
          where: { active: true },
          include: { options: true }
        },
        submissions: {
          where: { active: true },
          include: { answers: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!form) throw new Error('Formulário não encontrado');

    const questionMap = new Map(form.questions.map(q => [q.id, q.title]));
    const optionMap = new Map(
      form.questions.flatMap(q => q.options).map(o => [o.id, o.description])
    );

    const csvData = form.submissions.map(sub => {
      const row: any = {
        'ID da Submissão': sub.id,
        'Usuário': sub.user,
        'Data de Envio': sub.createdAt.toLocaleString('pt-BR'),
      };

      form.questions.forEach(q => {
        row[q.title] = '';
      });

      sub.answers.forEach(ans => {
        const questionTitle = questionMap.get(ans.questionId);
        if (!questionTitle) return;

        let answerText = ans.textValue || optionMap.get(ans.optionId) || '';

        if (row[questionTitle] && answerText) {
          row[questionTitle] += `, ${answerText}`;
        } else if (answerText) {
          row[questionTitle] = answerText;
        }
      });

      return row;
    });

    return Papa.unparse(csvData, {
      quotes: true,
      delimiter: ';'
    });
  }
}
