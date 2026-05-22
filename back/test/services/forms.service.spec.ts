import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from '../../src/forms/forms.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = {
  form: {
    findUnique: jest.fn(),
  },
};

describe('FormsService', () => {
  let service: FormsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportCsv', () => {
    it('should calculate the score and append it to the CSV', async () => {
      const mockForm = {
        id: 'form-1',
        title: 'Test Form',
        active: true,
        questions: [
          {
            id: 'q1',
            title: 'Q1',
            type: 'SINGLE',
            active: true,
            options: [
              { id: 'opt1', description: 'Option 1', correct: true },
              { id: 'opt2', description: 'Option 2', correct: false },
            ],
          },
        ],
        submissions: [
          {
            id: 'sub1',
            user: 'Test User',
            createdAt: new Date('2026-05-22T10:00:00Z'),
            active: true,
            answers: [
              { id: 'ans1', questionId: 'q1', optionId: 'opt1' },
            ],
          },
        ],
      };

      mockPrismaService.form.findUnique.mockResolvedValue(mockForm);

      const csv = await service.exportCsv('form-1');

      expect(csv).toContain('Pontuação (Acertos)');
      expect(csv).toContain('1 / 1');
      expect(csv).toContain('Test User');
    });
  });

  describe('getStats', () => {
    it('should aggregate correct and incorrect answers', async () => {
        const mockForm = {
            id: 'form-1',
            title: 'Test Form',
            active: true,
            questions: [
              {
                id: 'q1',
                title: 'Q1',
                type: 'SINGLE',
                active: true,
                options: [
                  { id: 'opt1', description: 'Option 1', correct: true },
                  { id: 'opt2', description: 'Option 2', correct: false },
                ],
              },
            ],
            submissions: [
              {
                id: 'sub1',
                active: true,
                answers: [
                  { id: 'ans1', questionId: 'q1', optionId: 'opt1' },
                ],
              },
              {
                  id: 'sub2',
                  active: true,
                  answers: [
                    { id: 'ans2', questionId: 'q1', optionId: 'opt2' },
                  ],
                },
            ],
          };

          mockPrismaService.form.findUnique.mockResolvedValue(mockForm);

          const stats = await service.getStats('form-1', null);

          expect(stats.totalSubmissions).toBe(2);
          expect(stats.questionsStats[0].correctAnswers).toBe(1);
          expect(stats.questionsStats[0].incorrectAnswers).toBe(1);
          expect(stats.questionsStats[0].optionsDistribution).toEqual([
              { name: 'Option 1', value: 1 },
              { name: 'Option 2', value: 1 }
          ]);
    });
  });
});
