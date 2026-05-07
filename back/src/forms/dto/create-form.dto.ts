import { IsString, IsOptional, MaxLength, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFormDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  title!: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;
}
