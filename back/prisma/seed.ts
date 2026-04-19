import "dotenv";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o Seeding...');

  await prisma.form.deleteMany();

  console.log('🧹 Banco limpo. Criando Formulário Base...');

  const baseForm = await prisma.form.create({
    data: {
      title: 'Avaliação Diagnóstica - História do Brasil',
      description: 'Prova destinada aos alunos do Ensino Médio sobre o Período Colonial.',
      questions: {
        create: [
          {
            title: 'Qual foi o **principal** produto de exportação do Brasil no século XVI?',
            required: true,
            options: {
              create: [
                { description: '_Café_', type: 'MARKDOWN', correct: false },
                { description: '_Açúcar_', type: 'MARKDOWN', correct: false },
                { description: '_Pau-Brasil_', type: 'MARKDOWN', correct: true },
              ],
            },
          },
          {
            title: 'Descreva, em poucas palavras, a importância das Capitanias Hereditárias.',
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
  });

  console.log('✅ Seeding concluído com sucesso!');
  console.log(`Formulário criado: ${baseForm.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });