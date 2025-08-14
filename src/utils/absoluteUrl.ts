import { envConfig } from "../config/envConfig.js";

export function absoluteUrl(path: string): string {
  return `http://${envConfig.frontendUrl}${path}`;
};