import { Logger } from '@nestjs/common';

export interface EnvironmentVariables {
  GEMINI_API_KEY: string;
  ROLE_PROMPT: string;
  TASK_PROMPT: string;
  // Add other environment variables here
}

export function validateEnv(): EnvironmentVariables {
  const logger = new Logger('EnvironmentValidator');

  const requiredEnvVars = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ROLE_PROMPT: process.env.ROLE_PROMPT,
    TASK_PROMPT: process.env.TASK_PROMPT,
    // Add other environment variables here
  };

  // Check for missing environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  // Exit the application if environment variables are missing
  if (missingVars.length > 0) {
    logger.error(
      `The following environment variables are not set: ${missingVars.join(', ')}`,
    );
    process.exit(1);
  }

  return requiredEnvVars as EnvironmentVariables;
}
