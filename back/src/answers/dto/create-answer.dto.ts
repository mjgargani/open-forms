import { IsNotEmpty, IsString, IsUUID, MaxLength, IsOptional } from "class-validator";

export class CreateAnswerDto {
  @IsOptional()
  @IsUUID()
  submissionId?: string;

  @IsNotEmpty()
  @IsUUID()
  questionId!: string;

  @IsOptional()
  @IsUUID()
  optionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  textValue?: string;
}