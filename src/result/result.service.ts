import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultDto } from 'src/completion/dto/create-result.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getResultById(id: string): Promise<CreateResultDto> {
    const targetResult = await this.prismaService.result.findUnique({
      where: {
        id,
      },
    });
    if (!targetResult) {
      throw new NotFoundException();
    }
    return {
      missingNutrients: targetResult.missingNutrients,
      recommendedFoods: targetResult.recommendedFoods,
      score: targetResult.score,
    };
  }
}
