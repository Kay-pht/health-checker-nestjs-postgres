import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  constructor(private readonly configService: ConfigService) {}

  async getChatCompletion(
    userPrompt: string,
    gemini: GoogleGenerativeAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY') as string,
    ),
  ): Promise<any> {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.0-pro-exp-02-05',
    });

    const structuredPrompt = this.prompt(
      userPrompt,
      this.configService.get('ROLE_PROMPT')!,
      this.configService.get('TASK_PROMPT')!,
    );

    const result = await model.generateContent(structuredPrompt);
    console.log('result:', result);

    // レスポンステキストからMarkdownのコードブロックを取り除く
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json\n|\n```|```/g, '').trim();

    return cleanedJson;
    // return responseText;
  }

  prompt = (
    userPrompt: string,
    rolePrompt: string,
    taskPrompt: string,
  ): string => {
    // Geminiに適したプロンプト形式で構築
    return `
    ${rolePrompt || 'assistant'}
    ${taskPrompt || 'hello'}

    ユーザーの回答：
        ${JSON.stringify(userPrompt)}

  以下のJSONスキーマに基づいた回答を生成してください。
  純粋なJSONオブジェクトのみを返してください。Markdownの記法やコードブロック（\`\`\`）は使わないでください。
  コメントや説明も含めないでください。

    NutritionResult = {
        'missingNutrients': Array<string>, // 不足している栄養素のリスト（最大4つ、最低1つ）
        'recommendedFoods': Array<string>, // 推奨される食材のリスト（最低4品目）
        'score': number // 食生活のスコア（100点満点）
        }

  Return: NutritionResult（純粋なJSONオブジェクトのみ、バッククォートや説明文なし）`;
  };
}
