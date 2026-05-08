import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- FÁBRICA DE RESPOSTAS (Helper para gerar submissões automáticas) ---
function generatePerfectAnswers(form: any, discursiveAnswerText: string) {
  const answers: any[] = [];
  
  for (const q of form.questions) {
    if (q.type === 'SINGLE' || q.type === 'MULTIPLE') {
      // Pega as opções corretas e as adiciona
      const correctOptions = q.options.filter((opt: any) => opt.correct === true);
      for (const opt of correctOptions) {
        answers.push({ questionId: q.id, optionId: opt.id });
      }
    } else if (q.type === 'DISCURSIVE') {
      // Pega o input de texto associado e adiciona a resposta
      const inputOpt = q.options.find((opt: any) => opt.type === 'INPUT');
      answers.push({
        questionId: q.id,
        optionId: inputOpt?.id, // Vincula a referência do input
        textValue: discursiveAnswerText
      });
    }
  }
  return answers;
}

async function main() {
  console.log('🌱 Iniciando o Seeding do Open-Forms...');

  // Limpa o banco na ordem certa para evitar erros de Foreign Key
  await prisma.submission.deleteMany();
  await prisma.form.deleteMany();

  console.log('🧹 Banco limpo. Criando as Provas (Templates)...');

  // =====================================================================
  // FORMULÁRIO 1: História do Brasil (O original, mantido)
  // =====================================================================
  const historyForm = await prisma.form.create({
    data: {
      title: 'Avaliação Diagnóstica - História do Brasil',
      description: 'Prova destinada aos alunos do Ensino Médio sobre o Período Colonial.',
      published: true,
      questions: {
        create: [
          {
            title: 'Qual foi o **principal produto** de exportação do Brasil no século XVI?',
            required: true,
            type: 'SINGLE',
            options: {
              create: [
                { description: 'Café', type: 'MARKDOWN', correct: false },
                { description: 'Açúcar', type: 'MARKDOWN', correct: true },
                { description: 'Pau-Brasil', type: 'MARKDOWN', correct: false },
              ],
            },
          },
          {
            title: 'Sobre a **mineração no Brasil Colonial** (século XVIII), quais afirmações são corretas?',
            required: true,
            type: 'MULTIPLE',
            options: {
              create: [
                { description: 'Ocorreu principalmente em Minas Gerais, Goiás e Mato Grosso.', type: 'MARKDOWN', correct: true },
                { description: 'Causou a transferência da capital de Salvador para o Rio de Janeiro em 1763.', type: 'MARKDOWN', correct: true },
                { description: 'Diminuiu a necessidade de mão de obra escravizada.', type: 'MARKDOWN', correct: false },
              ],
            },
          },
          {
            title: 'Explique a importância das **Capitanias Hereditárias** no início da colonização.',
            required: true,
            type: 'DISCURSIVE',
            options: {
              create: [
                { description: 'Critério: O aluno deve mencionar a transferência de custos de colonização da Coroa para particulares.', type: 'INPUT', correct: true },
              ],
            },
          },
        ],
      },
    },
    include: { questions: { include: { options: true } } }
  });

  // =====================================================================
  // FORMULÁRIO 2: Desenvolvimento Web Simples (Nova Inserção)
  // =====================================================================
  const webDevForm = await prisma.form.create({
    data: {
      title: 'Avaliação Básica - Desenvolvimento Web',
      description: 'Teste seus conhecimentos sobre as fundações da Web: HTML, CSS e JavaScript.',
      published: true,
      questions: {
        create: [
          {
            title: 'O que significa a sigla **HTML**?',
            required: true,
            type: 'SINGLE',
            options: {
              create: [
                { description: 'Home Tool Markup Language', type: 'MARKDOWN', correct: false },
                { description: 'HyperText Markup Language', type: 'MARKDOWN', correct: true },
                { description: 'Hyperlinks and Text Markup Language', type: 'MARKDOWN', correct: false },
              ],
            },
          },
          {
            title: 'Quais das opções abaixo são **Frameworks ou Bibliotecas CSS**?',
            required: true,
            type: 'MULTIPLE',
            options: {
              create: [
                { description: 'Tailwind CSS', type: 'MARKDOWN', correct: true },
                { description: 'React', type: 'MARKDOWN', correct: false },
                { description: 'Bootstrap', type: 'MARKDOWN', correct: true },
                { description: 'Django', type: 'MARKDOWN', correct: false },
              ],
            },
          },
          {
            title: 'Explique de forma sucinta a diferença entre **Frontend** e **Backend**.',
            required: true,
            type: 'DISCURSIVE',
            options: {
              create: [
                { description: 'Critério: O aluno deve mencionar que frontend é a interface visual e backend roda no servidor (regras e dados).', type: 'INPUT', correct: true },
              ],
            },
          },
        ],
      },
    },
    include: { questions: { include: { options: true } } }
  });

  console.log('📝 Provas criadas! Gerando submissões simuladas (Alunos respondendo)...');

  // =====================================================================
  // SIMULANDO AS SUBMISSÕES ATÔMICAS
  // =====================================================================
  
  // Aluno 1 responde a prova de História
  await prisma.submission.create({
    data: {
      user: '2026101 - Maria Oliveira',
      formId: historyForm.id,
      answers: {
        create: generatePerfectAnswers(
          historyForm, 
          "As Capitanias Hereditárias foram cruciais para a primeira tentativa de colonização, transferindo a responsabilidade financeira da nobreza portuguesa para particulares."
        )
      }
    }
  });

  // Aluno 2 responde a prova de Web Dev
  await prisma.submission.create({
    data: {
      user: '2026102 - João Silva',
      formId: webDevForm.id,
      answers: {
        create: generatePerfectAnswers(
          webDevForm,
          "O Frontend é a parte visual do site (telas, botões) que roda no navegador, usando HTML, CSS e JS. O Backend é a lógica que roda no servidor, processando dados e conectando ao banco de dados."
        )
      }
    }
  });

  console.log(`✅ Submissões registradas com sucesso para os dois formulários!`);
  console.log(`🔗 Dica: Acesse http://localhost:5173/view/${webDevForm.id} para ver a nova prova de Web Dev!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });