import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  title!: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;
}
