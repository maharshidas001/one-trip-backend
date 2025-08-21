import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../libs/apiError";
import { envConfig } from "../config/envConfig";

export const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error!';
  const error = err.error;

  const isDevEnv = envConfig.nodeEnv === 'development';

  const response = {
    success: err.success,
    message,
    statusCode,
    error,
    ...(isDevEnv && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};