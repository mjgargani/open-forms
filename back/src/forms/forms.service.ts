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
    return this.prisma.form.findMany({
      include: {
        questions: {
          include: { 
            options: true 
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          include: { 
            options: true 
          }
        }
      }
    });
  }

  update(id: string, updateFormDto: UpdateFormDto) {
    const { questions, ...formPrimitiveData } = updateFormDto;

    return this.prisma.form.update({
      where: { id },
      data: {
        ...formPrimitiveData,

        ...(questions && {
          questions: {
            // Deleta as questões antigas que NÃO vieram neste array
            deleteMany: {
              id: { notIn: questions.map((q) => q.id).filter(Boolean) as string[] },
            },
            
            // Atualiza as existentes ou Cria as novas (Upsert)
            upsert: questions.map((question) => ({
              where: { id: question.id || '' },
              
              // Se não existir no banco, CRIA a questão e as opções dela
              create: {
                id: question.id,
                title: question.title || '',
                type: question.type,
                required: question.required,
                options: {
                  create: question.options?.map(opt => ({
                    id: opt.id,
                    description: opt.description || '',
                    type: opt.type,
                    correct: opt.correct
                  })) || []
                }
              },
              
              // Se já existir, ATUALIZA a questão e gerencia as opções aninhadas dela
              update: {
                title: question.title,
                type: question.type,
                required: question.required,
                active: question.active,
                ...(question.options && {
                  options: {
                    // Deleta as opções que foram removidas desta questão específica
                    deleteMany: {
                      id: { notIn: question.options.map((o) => o.id).filter(Boolean) as string[] }
                    },
                    // Cria ou atualiza as opções enviadas
                    upsert: question.options.map((opt) => ({
                      where: { id: opt.id || '' },
                      create: {
                        id: opt.id,
                        description: opt.description || '',
                        type: opt.type,
                        correct: opt.correct
                      },
                      update: {
                        description: opt.description,
                        type: opt.type,
                        correct: opt.correct,
                        active: opt.active
                      }
                    }))
                  }
                })
              }
            }))
          }
        })
      },
      // Retornamos a árvore completa para o cache do React Query
      include: {
        questions: {
          include: { options: true }
        }
      }
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
