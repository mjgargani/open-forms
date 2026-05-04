import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

type SubmissionMockForm = {
  questionId: string,
  optionId: string
}[]

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o Seeding...');

  await prisma.submission.deleteMany();
  await prisma.form.deleteMany();

  console.log('🧹 Banco limpo. Criando a Prova Base (Template)...');

  const baseForm = await prisma.form.create({
    data: {
      title: 'Avaliação Diagnóstica - História do Brasil',
      description: 'Prova destinada aos alunos do Ensino Médio sobre o Período Colonial.',
      published: true,
      questions: {
        create: [
          {
            title: 'Qual foi o **principal produto** de exportação do Brasil no século XVI?',
            required: true,
            options: {
              create: [
                { description: 'Café', type: 'MARKDOWN', correct: false },
                { description: 'Açúcar', type: 'MARKDOWN', correct: true },
                { description: 'Pau-Brasil', type: 'MARKDOWN', correct: false },
              ],
            },
          },
          {
            title: 'Descreva, **em poucas palavras**, a importância das Capitanias Hereditárias.',
            required: false,
            options: {
              create: [
                { description: 'Espaço reservado para o texto do aluno...', type: 'INPUT', correct: true },
              ]
            }
          },
        ],
      },
    },
    // 'uuids' para gerar respostas
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  console.log(`✅ Prova criada: ${baseForm.title}`);
  console.log('📝 Simulando a execução da prova por um aluno...');

  const mockFormSelection: SubmissionMockForm = baseForm.questions[0].options
      .filter(option => option.correct === true && option.type === "MARKDOWN")
      .map(option => 
        ({ 
          questionId: baseForm.questions[0].id,
          optionId: option.id
        })) || [];
  
  const mockFormInput: SubmissionMockForm = baseForm.questions[1].options
      .filter(option => option.correct === true && option.type === "INPUT")
      .map(option => 
        ({ 
          questionId: baseForm.questions[1].id,
          optionId: option.id,
          textValue: "As Capitanias Hereditárias foram cruciais para a primeira tentativa de colonização e povoamento do Brasil por Portugal, utilizando recursos privados da nobreza para dividir, proteger e iniciar a exploração econômica do território, com destaque para a cana-de-açúcar. (Brasil Escola, 2026)"
        })) || [];

  console.log({ mockFormSelection, mockFormInput });

  const formSubmission = await prisma.submission.create({
    data: {
      user: '2026101 - Maria Oliveira',
      formId: baseForm.id,
      answers: {
        create: [
          ...mockFormSelection,
          ...mockFormInput
        ]
      }
    },
    include: {
      answers: true
    }
  });
  
  console.log(`✅ Submissão registrada com sucesso para: ${formSubmission.user}`);

  console.log({ 
    baseForm: JSON.stringify(baseForm, null, 2), 
    formSubmission: JSON.stringify(formSubmission, null, 2) 
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro crítico durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });