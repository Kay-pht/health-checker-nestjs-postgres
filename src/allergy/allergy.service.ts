import { Injectable } from '@nestjs/common';
import { AllergyTypes, UserAllergy } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AllergyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAllergyType(name: string): Promise<AllergyTypes> {
    try {
      const allergyType = await this.prismaService.allergyTypes.create({
        data: {
          name,
        },
      });
      return allergyType;
    } catch (error) {
      console.error('failed to create allergy type', error);
      throw error;
    }
  }

  async registerUserAllergyInfo(
    userId: string,
    allergies: { [key: string]: string },
  ) {
    try {
      // Delete existing user allergy information (for update)
      await this.prismaService.userAllergy.deleteMany({
        where: { userId },
      });

      // Register new allergy information
      const allergyEntries = Object.entries(allergies);

      // Early return if no allergy information
      if (allergyEntries.length === 0) {
        return {
          success: true,
          message: 'Allergy information updated (no entries)',
        };
      }

      // Save each allergy information to database
      const createPromises = allergyEntries.map(([allergyId, severity]) => {
        return this.prismaService.userAllergy.create({
          data: {
            userId,
            allergyId,
            severity,
          },
        });
      });

      // Execute all save operations in parallel
      await Promise.all(createPromises);

      return {
        success: true,
        message: 'Allergy information registered',
        count: allergyEntries.length,
      };
    } catch (error) {
      console.error(
        'Error occurred while registering allergy information:',
        error,
      );
      throw error;
    }
  }

  async getAllergyList(): Promise<AllergyTypes[]> {
    try {
      return await this.prismaService.allergyTypes.findMany();
    } catch (error) {
      console.error('Error occurred while retrieving allergy list:', error);
      throw error;
    }
  }

  async getUserAllergyList(userId: string): Promise<UserAllergy[]> {
    try {
      return await this.prismaService.userAllergy.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error(
        'Error occurred while retrieving user allergy list:',
        error,
      );
      throw error;
    }
  }

  async deleteUserAllergy(
    userId: string,
    allergyId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.prismaService.userAllergy.delete({
        where: {
          userId_allergyId: {
            // Correct format for composite unique constraint
            userId: userId,
            allergyId: allergyId,
          },
        },
      });
      return {
        success: true,
        message: 'Allergy information deleted',
      };
    } catch (error) {
      console.error('Error occurred while deleting user allergy:', error);
      throw error;
    }
  }
}
