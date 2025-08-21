import { config } from "dotenv";

config();

interface IEnvConfig {
  port: string;
  nodeEnv: string;
  accessExpiry: string;
  accessSecret: string;
  refreshExpiry: string;
  refreshSecret: string;
  mongodbUri: string;
  geminiKey: string;
  imageKey: string,
  frontendUrl: string,
}

const _conf: IEnvConfig = {
  port: process.env.PORT as string,
  nodeEnv: process.env.NODE_ENV as string,
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY as string,
  accessSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY as string,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET as string,
  mongodbUri: process.env.MONGODB_URI as string,
  geminiKey: process.env.GEMINI_API_KEY as string,
  imageKey: process.env.UNSPLASH_ACCESS_KEY as string,
  frontendUrl: process.env.FRONTEND_URL as string,
};

export const envConfig = Object.freeze(_conf);