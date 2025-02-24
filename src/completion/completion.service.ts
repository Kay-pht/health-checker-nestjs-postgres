import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class CompletionService {
  constructor(private readonly openaiService: OpenaiService) {}

  async getAnalysis(prompt: string): Promise<string | null> {
    // TODO:completionFunc
    console.log(prompt);
    try {
      const response: string | null =
        await this.openaiService.getChatCompletion(prompt);
      // TODO:save analysis in db
      return response;
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }
}
