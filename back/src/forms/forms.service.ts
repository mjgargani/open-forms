import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as Papa from 'papaparse';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  create(createFormDto: CreateFormDto, userId: string) {
    return this.prisma.form.create({
      data: { ...createFormDto, userId }
    });
  }

  findAll(userId: string | null) {
    return this.prisma.form.findMany({
      where: userId ? { userId, active: true } : { active: true },
      include: {
        user: { select: { name: true } },
        _count: {
            select: { submissions: true }
        }
      }
    });
  }

  findOne(id: string, userId: string | null) {
    const whereClause: { id: string; active: boolean; userId?: string } = { id, active: true };
    if (userId) {
        whereClause.userId = userId;
    }
    return this.prisma.form.findUnique({
      where: whereClause,
      include: {
        questions: {
          where: { active: true },
          include: { 
            options: { where: { active: true } }
          }
        },
        submissions: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: { submissions: true }
        }
      }
    });
  }

  update(id: string, updateFormDto: UpdateFormDto, userId: string | null) {
    const { questions, ...formPrimitiveData } = updateFormDto;

    const whereClause: { id: string; userId?: string } = { id };
    if (userId) {
        whereClause.userId = userId;
    }

    return this.prisma.form.update({
      where: whereClause,
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

  remove(id: string, userId: string | null) {
    const whereClause: { id: string; userId?: string } = { id };
    if (userId) {
        whereClause.userId = userId;
    }
    return this.prisma.form.update({
      where: whereClause,
      data: { active: false }
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
      const row: Record<string, string | number> = {
        'ID da Submissão': sub.id,
        'Usuário': sub.user,
        'Data de Envio': sub.createdAt.toLocaleString('pt-BR'),
      };

      form.questions.forEach(q => {
        row[q.title] = '';
      });

      let score = 0;
      let totalQuestions = form.questions.length;

      sub.answers.forEach(ans => {
        const question = form.questions.find(q => q.id === ans.questionId);
        if (!question) return;
        const questionTitle = question.title;

        let answerText = ans.textValue || optionMap.get(ans.optionId) || '';

        if (row[questionTitle] && answerText) {
          row[questionTitle] += `, ${answerText}`;
        } else if (answerText) {
          row[questionTitle] = answerText;
        }

        // Grade the answer
        if (question.type === 'SINGLE' || question.type === 'MULTIPLE') {
             const selectedOption = question.options.find(opt => opt.id === ans.optionId);
             if (selectedOption && selectedOption.correct) {
                 score++;
             }
        }
      });

      row['Pontuação (Acertos)'] = `${score} / ${totalQuestions}`;

      return row;
    });

    return Papa.unparse(csvData, {
      quotes: true,
      delimiter: ';'
    });
  }

  /**
   * Retrieves statistical data for a specific form.
   * This is used to build the Business Intelligence (BI) dashboard on the frontend.
   * It calculates the total number of submissions, average score, and option distribution
   * per question.
   *
   * @param id - The ID of the form.
   * @param userId - The ID of the user requesting the stats (for RBAC isolation).
   * @returns Aggregated statistics data.
   */
  async getStats(id: string, userId: string | null) {
      const whereClause: { id: string; active: boolean; userId?: string } = { id, active: true };
      if (userId) {
          whereClause.userId = userId;
      }

      const form = await this.prisma.form.findUnique({
          where: whereClause,
          include: {
              questions: {
                  where: { active: true },
                  include: { options: true }
              },
              submissions: {
                  where: { active: true },
                  include: { answers: true }
              }
          }
      });

      if (!form) throw new Error('Formulário não encontrado');

      const totalSubmissions = form.submissions.length;

      const stats = form.questions.map(question => {
          const answers = form.submissions.flatMap(sub => sub.answers.filter(ans => ans.questionId === question.id));

          let correctAnswers = 0;
          let incorrectAnswers = 0;
          const optionsDistribution: Record<string, number> = {};

          question.options.forEach(opt => {
              optionsDistribution[opt.description] = 0;
          });

          answers.forEach(ans => {
              if (question.type === 'SINGLE' || question.type === 'MULTIPLE') {
                  const selectedOption = question.options.find(opt => opt.id === ans.optionId);
                  if (selectedOption) {
                      optionsDistribution[selectedOption.description] = (optionsDistribution[selectedOption.description] || 0) + 1;
                      if (selectedOption.correct) {
                          correctAnswers++;
                      } else {
                          incorrectAnswers++;
                      }
                  }
              }
          });

          return {
              questionId: question.id,
              questionTitle: question.title,
              type: question.type,
              correctAnswers,
              incorrectAnswers,
              optionsDistribution: Object.entries(optionsDistribution).map(([name, value]) => ({ name, value }))
          };
      });

      return {
          totalSubmissions,
          questionsStats: stats
      };
  }
}
