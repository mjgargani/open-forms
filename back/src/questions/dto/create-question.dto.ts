import { IsNotEmpty, IsString, IsUUID, MaxLength, IsEnum } from "class-validator";
import { QuestionType } from "../../generated/prisma/enums";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  title!: string;

  @IsUUID()
  formId!: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  type!: QuestionType;
}
