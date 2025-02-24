import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompletionService } from './completion.service';

@Controller('completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post()
  analyzeAnswer(@Body('answer') answer: string): Promise<string | null> {
    return this.completionService.getAnalysis(answer);
  }
}
