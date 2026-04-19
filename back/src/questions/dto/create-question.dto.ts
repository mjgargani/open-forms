import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  title!: string;

  @IsUUID()
  formId!: string;
}
