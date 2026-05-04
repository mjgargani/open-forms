import { IsNotEmpty, IsString, IsUUID, MaxLength, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { CreateAnswerDto } from "../../answers/dto/create-answer.dto"

export class CreateSubmissionDto {
  @IsString()
  user: string;

  @IsUUID()
  formId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
