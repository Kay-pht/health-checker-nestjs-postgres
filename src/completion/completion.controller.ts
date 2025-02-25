import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CreateResultDto } from './dto/create-result.dto';

@Controller('completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post()
  postAnalyzeAnswer(
    @Body('answer') answer: string,
  ): Promise<CreateResultDto | null> {
    return this.completionService.getAnalysis(answer);
  }
}
