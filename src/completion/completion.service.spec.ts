import { Test } from '@nestjs/testing';
import { CompletionService } from './completion.service';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { Logger } from '@nestjs/common';

describe('CompletionService', () => {
  let prismaService: PrismaService;
  let geminiService: GeminiService;
  let completionService: CompletionService;

  const mockPrismaService = {
    result: {
      create: jest.fn(),
    },
  };
  const mockGeminiService = {
    getChatCompletion: jest.fn(),
  };

  const result = {
    missingNutrients: ['vitamin C', 'calcium'],
    recommendedFoods: ['orange', 'milk'],
    score: 85,
  };
  const userId = '123';
  const prompt = 'Please analyze the following answer:';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompletionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: GeminiService,
          useValue: mockGeminiService,
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    geminiService = module.get<GeminiService>(GeminiService);
    completionService = module.get<CompletionService>(CompletionService);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  describe('saveResult', () => {
    it('should save the result', async () => {
      (prismaService.result.create as jest.Mock).mockResolvedValue({
        id: '123',
        ...result,
        userId,
      });

      const savedResult = await completionService.saveResult(result, userId);

      expect(savedResult).toEqual({
        id: '123',
        ...result,
        userId,
      });
    });

    it('should throw an error if the result is not saved', async () => {
      (prismaService.result.create as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to save'),
      );

      await expect(() =>
        completionService.saveResult(result, userId),
      ).rejects.toThrow('Failed to save analysis results');
    });

    it('should throw an error if the result is not a valid JSON', async () => {
      (prismaService.result.create as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid JSON'),
      );
      await expect(() =>
        completionService.saveResult(result, userId),
      ).rejects.toThrow();
    });
  });

  describe('getAnalysis', () => {
    it('should return the analysis result', async () => {
      (geminiService.getChatCompletion as jest.Mock).mockResolvedValue(
        JSON.stringify(result),
      );

      const analysisResult = await completionService.getAnalysis(
        prompt,
        userId,
      );

      expect(analysisResult).toEqual(result);
    });

    it('should throw an error if the response is empty', async () => {
      (geminiService.getChatCompletion as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(null),
      );

      await expect(() =>
        completionService.getAnalysis(prompt, userId),
      ).rejects.toThrow();
    });
  });
});
