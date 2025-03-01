import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDashboardDto } from './dto/userDashboard.dto';
import { AllergyTypes, Prisma, Result, UserAllergy } from '@prisma/client';
import { UserWithRelations } from 'src/types/userWithRelations';
import { AnalysisResult } from 'src/types/analysisResult';
import {
  AnalysisResultDto,
  UpdateUserDashboardDto,
} from './dto/update-userDashboard.dto';
import { UserInfoDto } from './dto/update-userDashboard.dto';
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

  async updateUserDashboardData(
    userId: string,
    updateUserDashboardDto: UpdateUserDashboardDto,
  ): Promise<UserDashboardDto> {
    try {
      await this.prismaService.$transaction(
        async (tx) => {
          if (updateUserDashboardDto.userInfo) {
            await this.updateUserInfo(
              userId,
              updateUserDashboardDto.userInfo,
              tx,
            );
          }
          if (updateUserDashboardDto.analysisResults) {
            await this.updateAnalysisResults(
              userId,
              updateUserDashboardDto.analysisResults,
              tx,
            );
          }
          // await this.updateUserAllergy(userId, updateUserDashboardDto.allergyList);
        },
        {
          timeout: 5000,
          isolationLevel: 'ReadCommitted',
        },
      );
      return this.getUserDashboardData(userId);
    } catch (error) {
      console.error('Error updating user dashboard data:', error);
      throw error;
    }
  }

  async updateUserInfo(
    userId: string,
    userInfo: UserInfoDto,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const dataToUpdate: UserInfoDto = {};

    if (userInfo.name) {
      dataToUpdate.name = userInfo.name;
    }
    if (userInfo.email) {
      dataToUpdate.email = userInfo.email;
    }
    if (userInfo.password) {
      dataToUpdate.password = userInfo.password;
    }

    await tx.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
  }

  async updateAnalysisResults(
    userId: string,
    analysisResults: AnalysisResultDto,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const dataToUpdate: AnalysisResultDto = {
      id: analysisResults.id,
    };

    if (analysisResults.missingNutrients) {
      dataToUpdate.missingNutrients = analysisResults.missingNutrients;
    }
    if (analysisResults.recommendedFoods) {
      dataToUpdate.recommendedFoods = analysisResults.recommendedFoods;
    }
    if (analysisResults.score) {
      dataToUpdate.score = analysisResults.score;
    }

    await tx.result.update({
      where: { id: analysisResults.id, userId: userId },
      data: dataToUpdate,
    });
  }
}

// updateUserAllergy(userId: string, allergyList: AllergyItemDto[]) {}
