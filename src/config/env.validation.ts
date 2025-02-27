import { Logger } from '@nestjs/common';

export interface EnvironmentVariables {
  GEMINI_API_KEY: string;
  ROLE_PROMPT: string;
  TASK_PROMPT: string;
  // 他の環境変数もここに追加
}

export function validateEnv(): EnvironmentVariables {
  const logger = new Logger('EnvironmentValidator');

  const requiredEnvVars = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ROLE_PROMPT: process.env.ROLE_PROMPT,
    TASK_PROMPT: process.env.TASK_PROMPT,
    // 他の環境変数もここに追加
  };

  // 不足している環境変数をチェック
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    logger.error(
      `以下の環境変数が設定されていません: ${missingVars.join(', ')}`,
    );
    process.exit(1);
  }

  return requiredEnvVars as EnvironmentVariables;
}
