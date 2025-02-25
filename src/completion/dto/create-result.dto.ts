import { IsInt, IsString } from 'class-validator';

export class CreateResultDto {
  @IsString({ each: true })
  missingNutrients: string[];

  @IsString({ each: true })
  recommendedFoods: string[];

  @IsInt()
  score: number;
}
