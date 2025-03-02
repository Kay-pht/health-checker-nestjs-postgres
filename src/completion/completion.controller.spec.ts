import { Test } from '@nestjs/testing';
import { CompletionController } from './completion.controller';
import { CompletionService } from './completion.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RequestUser } from 'src/types/requestUser';

describe('CompletionController', () => {
  let controller: CompletionController;
  let completionService: CompletionService;

  const mockCompletionService = {
    getAnalysis: jest.fn(),
  };

  const answer = 'Please analyze the following answer:';
  const mockRequest = {
    user: {
      userId: '123',
      userName: 'testUser',
    },
  } as Request & { user: RequestUser };
  const result = {
    missingNutrients: ['vitamin C', 'calcium'],
    recommendedFoods: ['orange', 'milk'],
    score: 85,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompletionController,
        {
          provide: CompletionService,
          useValue: mockCompletionService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CompletionController>(CompletionController);
    completionService = module.get<CompletionService>(CompletionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postAnalyzeAnswer', () => {
    it('should return the analysis result', async () => {
      (completionService.getAnalysis as jest.Mock).mockResolvedValueOnce(
        result,
      );

      const response = await controller.postAnalyzeAnswer(answer, mockRequest);

      expect(response).toEqual(result);
    });
  });
});
