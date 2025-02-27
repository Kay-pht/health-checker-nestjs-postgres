import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDashboardDto } from './dto/userDashboard.dto';
import { AllergyTypes, Result, UserAllergy } from '@prisma/client';
import { UserWithRelations } from 'src/types/userWithRelations';
import { AnalysisResult } from 'src/types/analysisResult';

@Injectable()
export class UserDashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserDashboardData(userId: string): Promise<UserDashboardDto> {
    const user = await this.getUserData(userId);
    return this.mapUserToDto(user);
  }

  async getUserData(userId: string): Promise<UserWithRelations> {
    try {
      // findUniqueはfindFirstに比べて、パフォーマンス面で有利なので、一意なデータを取得する場合に使用する
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          Result: true,
          UserAllergy: {
            include: {
              allergy: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      throw error;
    }
  }

  private mapUserToDto(user: UserWithRelations): UserDashboardDto {
    return {
      allergyList: this.mapAllergies(user.UserAllergy),
      userInfo: {
        username: user.name,
        email: user.email,
      },
      analysisResults: this.mapAnalysisResults(user.Result),
    };
  }

  private mapAllergies(
    userAllergy: (UserAllergy & { allergy: AllergyTypes })[],
  ) {
    return userAllergy.map((allergy) => ({
      allergyId: allergy.allergyId,
      allergyName: allergy.allergy.name,
      severity: allergy.severity,
    }));
  }

  private mapAnalysisResults(results: Result[]): AnalysisResult[] {
    return results.map((result) => ({
      missingNutrients: result.missingNutrients,
      recommendedFoods: result.recommendedFoods,
      score: result.score,
    }));
  }
}
