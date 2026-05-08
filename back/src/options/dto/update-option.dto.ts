import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { OptionType } from "@/generated/prisma/enums";

export class UpdateOptionDto {
  @IsOptional()
  @IsString()
  id?: string; // Gerado pelo Front

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OptionType)
  type?: OptionType;

  @IsOptional()
  @IsBoolean()
  correct?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}