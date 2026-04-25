import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateSubmissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  user!: string;

  @IsNotEmpty()
  @IsUUID()
  formId!: string;
}
