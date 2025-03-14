import { Injectable } from '@nestjs/common';
import { HistoryDto } from 'src/mypage/dto/history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MypageService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHistory(userId: string): Promise<HistoryDto[]> {
    const historyResults = await this.prismaService.result.findMany({
      where: {
        userId,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (!historyResults) {
      return [];
    }
    return historyResults.map((result) => ({
      resultId: result.id,
      missingNutrients: result.missingNutrients,
      recommendedFoods: result.recommendedFoods,
      score: result.score,
      createdAt: result.createdAt,
    }));
  }
}
