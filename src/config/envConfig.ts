import { config } from "dotenv";

config();

const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

interface IEnvConfig {
  port: string;
  nodeEnv: string;
  accessExpiry: string;
  accessSecret: string;
  refreshExpiry: string;
  refreshSecret: string;
  mongodbUri: string;
}

const _conf: Readonly<IEnvConfig> = {
  port: getEnv("PORT"),
  nodeEnv: getEnv("NODE_ENV"),
  accessExpiry: getEnv("ACCESS_TOKEN_EXPIRY"),
  accessSecret: getEnv("ACCESS_TOKEN_SECRET"),
  refreshExpiry: getEnv("REFRESH_TOKEN_EXPIRY"),
  refreshSecret: getEnv("REFRESH_TOKEN_SECRET"),
  mongodbUri: getEnv("MONGODB_URI"),
};

export const envConfig = Object.freeze(_conf);