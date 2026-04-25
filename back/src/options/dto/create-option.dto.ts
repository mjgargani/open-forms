import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { OptionType } from "../../generated/prisma/enums";

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  description!: string;

  @IsNotEmpty()
  @IsEnum(OptionType)
  type!: OptionType;

  @IsUUID()
  questionId!: string;
}
