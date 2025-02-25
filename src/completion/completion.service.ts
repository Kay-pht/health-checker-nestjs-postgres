import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { analyzedResponse } from 'src/types/analyzedResponse';
import { CreateResultDto } from './dto/create-result.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompletionService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAnalysis(prompt: string): Promise<CreateResultDto | null> {
    // TODO:completionFunc
    try {
      const response: string | null =
        await this.openaiService.getChatCompletion(prompt);
      console.log('response:', response);
      if (!response) {
        return null;
      }
      const parsedResponse = JSON.parse(response) as analyzedResponse;
      console.log('jsonResponse:', parsedResponse);
      // TODO:save analysis in db
      const createResultDto: CreateResultDto = {
        missingNutrients: parsedResponse.missingNutrients,
        recommendedFoods: parsedResponse.recommendedFoods,
        score: parsedResponse.score,
      };
      const savedResult = await this.prismaService.result.create({
        data: {
          ...createResultDto,
        },
      });

      return {
        missingNutrients: savedResult.missingNutrients,
        recommendedFoods: savedResult.recommendedFoods,
        score: savedResult.score,
      };
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }
}
