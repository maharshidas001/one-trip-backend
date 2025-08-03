import { config } from "dotenv";

config();

const _conf = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  mongodbUri: process.env.MONGODB_URI,
} as const;

export const envConfig = Object.freeze(_conf);