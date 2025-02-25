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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1.5,
      messages: this.prompt(
        this.configService.get('ROLE_PROMPT')!,
        this.configService.get('TASK_PROMPT')!,
        userPrompt,
      ),
    });
    const responseFromAI = completion.choices[0].message.content;
    return responseFromAI;
  }

  prompt = (
    userPrompt: string,
    rolePrompt: string,
    taskPrompt: string,
  ): ChatCompletionMessageParam[] => {
    return [
      {
        role: 'system',
        content: rolePrompt || 'assistant',
      },
      {
        role: 'user',
        content: taskPrompt || 'hello',
      },

      {
        role: 'system',
        content: '指示に従い,フォーマットに沿ってすべての項目に回答します。',
      },

      {
        role: 'user',
        content: JSON.stringify(userPrompt),
      },
    ];
  };
}
