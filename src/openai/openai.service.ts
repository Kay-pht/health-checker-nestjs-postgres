import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenaiService {
  constructor(private readonly configService: ConfigService) {}
  async getChatCompletion(
    userPrompt: string,
    openai: OpenAI = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    }),
  ): Promise<string | null> {
    // TODO:connect openai api
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 1.5,
        messages: this.prompt(userPrompt),
      });
      console.log(completion);
      const responseFromAI = completion.choices[0].message.content;
      console.log(responseFromAI);
      return responseFromAI;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  prompt = (userPrompt: string): ChatCompletionMessageParam[] => {
    return [
      {
        role: 'system',
        content: 'you are a helpful assistant',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];
  };
}
