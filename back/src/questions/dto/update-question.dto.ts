import { IsString, IsBoolean, IsOptional, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from "@/generated/prisma/enums";
import { UpdateOptionDto } from '@/options/dto/update-option.dto';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  id?: string; // Gerado pelo Front

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // O Elo da Corrente: Valida as Opções dentro da Questão
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOptionDto)
  options?: UpdateOptionDto[];
}