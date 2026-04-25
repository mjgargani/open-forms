import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsUUID()
  submissionId!: string;

  @IsNotEmpty()
  @IsUUID()
  questionId!: string;

  @IsNotEmpty()
  @IsUUID()
  optionId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  textValue?: string;
}
