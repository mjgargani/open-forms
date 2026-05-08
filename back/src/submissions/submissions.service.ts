import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  create(createSubmissionDto: CreateSubmissionDto) {
    return this.prisma.submission.create({
      data: {
        user: createSubmissionDto.user,
        formId: createSubmissionDto.formId,
        answers: {
          create: createSubmissionDto.answers.map(ans => ({
            questionId: ans.questionId,
            optionId: ans.optionId,
            textValue: ans.textValue,
          }))
        }
      }
    });
  }

  findAll() {
    return `This action returns all submissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submission`;
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
