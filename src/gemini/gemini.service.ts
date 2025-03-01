import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly gemini: GoogleGenerativeAI;
  private readonly modelName: string;
  private readonly rolePrompt: string;
  private readonly taskPrompt: string;

  constructor(private readonly configService: ConfigService) {
    // Environment variables are already validated, so default values should not be used
    this.gemini = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY') || '',
    );
    this.modelName = this.configService.get<string>(
      'GEMINI_MODEL_NAME',
    ) as string;
    this.rolePrompt = this.configService.get<string>(
      'GEMINI_ROLE_PROMPT',
    ) as string;
    this.taskPrompt = this.configService.get<string>(
      'GEMINI_TASK_PROMPT',
    ) as string;
  }

  /**
   * Get chat completion from Gemini AI using user prompt
   * @param userPrompt Input prompt from user
   * @returns Parsable JSON string
   */
  async getChatCompletion(userPrompt: string): Promise<string> {
    try {
      const model = this.gemini.getGenerativeModel({
        model: this.modelName,
      });

      const structuredPrompt = this.buildPrompt(userPrompt);
      this.logger.debug(`Sending prompt to Gemini: ${structuredPrompt}`);

      const result = await model.generateContent(structuredPrompt);
      const responseText = result.response.text();

      // Remove Markdown code blocks from response text
      const cleanedJson = this.cleanJsonResponse(responseText);

      if (!cleanedJson) {
        throw new InternalServerErrorException('Empty response returned');
      }

      return cleanedJson;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error occurred during Gemini API call: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          `Failed to get response from AI model: ${error.message}`,
        );
      }
      throw error;
    }
  }

  // Build structured prompt
  private buildPrompt(userPrompt: string): string {
    return `
    ${this.rolePrompt}
    ${this.taskPrompt}

    User's response:
        ${JSON.stringify(userPrompt)}

  Please generate a response in Japanese based on the following JSON schema.
  Return only a pure JSON object. Do not use Markdown syntax or code blocks (\`\`\`).
  Do not include comments or explanations.

    NutritionResult = {
        'missingNutrients': Array<string>, // List of missing nutrients (max 4, min 1)
        'recommendedFoods': Array<string>, // List of recommended foods (min 4 items)
        'score': number // Diet score (out of 100)
        }

  Return: NutritionResult (pure JSON object only, no backticks or explanatory text)`;
  }

  // Remove Markdown code blocks from response
  private cleanJsonResponse(response: string): string {
    return response.replace(/```json\n|\n```|```/g, '').trim();
  }
}
