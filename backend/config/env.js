import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

function loadEnv() {
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    throw new Error(`Failed to load .env file from ${envPath}`);
  }

  const requiredEnvVars = ['NEWS_API_KEY', 'PORT'];
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    PORT: parseInt(process.env.PORT) || 5001
  };
}

export const config = loadEnv();
