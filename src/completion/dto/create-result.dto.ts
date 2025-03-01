import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateResultDto {
  @IsString({ each: true })
  @IsNotEmpty()
  missingNutrients: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  recommendedFoods: string[];

  @IsInt()
  @IsNotEmpty()
  score: number;
}
