import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { analyzedResponse } from 'src/types/analyzedResponse';
import { CreateResultDto } from './dto/create-result.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class CompletionService {
  private readonly logger = new Logger(CompletionService.name);

  constructor(
    // private readonly openaiService: OpenaiService,
    private readonly geminiService: GeminiService,
    private readonly prismaService: PrismaService,
  ) {}
  async getAnalysis(
    prompt: string,
    userId: string,
  ): Promise<CreateResultDto | null> {
    try {
      this.logger.log(`Analyzing prompt for user: ${userId}`);

      // Get response from AI model
      const response = await this.geminiService.getChatCompletion(prompt);
      if (!response) {
        this.logger.warn('Empty response returned from AI model');
        return null;
      }

      // Parse response
      const parsedResponse = this.parseResponse(response);

      // Save results to database
      const savedResult = await this.saveResult(parsedResponse, userId);

      this.logger.log(
        `Analysis completed for user: ${userId} with score: ${savedResult.score}`,
      );

      return {
        missingNutrients: savedResult.missingNutrients,
        recommendedFoods: savedResult.recommendedFoods,
        score: savedResult.score,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error occurred during analysis: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Analysis failed: ${error.message}`,
        );
      }
      throw error;
    }
  }

  // Parse response from AI mode
  private parseResponse(response: string): analyzedResponse {
    try {
      return JSON.parse(response) as analyzedResponse;
    } catch {
      throw new InternalServerErrorException('Failed to parse AI response');
    }
  }

  // Save analysis results to database
  private async saveResult(result: analyzedResponse, userId: string) {
    const createResultDto: CreateResultDto = {
      missingNutrients: result.missingNutrients,
      recommendedFoods: result.recommendedFoods,
      score: result.score,
    };

    try {
      return await this.prismaService.result.create({
        data: {
          ...createResultDto,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to save results: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          'Failed to save analysis results',
        );
      }
      throw error;
    }
  }
}
