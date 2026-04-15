import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @MaxLength(280)
  title!: string;
  
  @IsString()
  @IsOptional()
  @MaxLength(280)
  description?: string;
}
