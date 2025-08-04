import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { envConfig } from "../config/envConfig.js";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error!';

  const isDevEnv = envConfig.nodeEnv === 'development';
  console.log('GLOBAL ERROR HANDLER :: ', err);

  const response = {
    success: err.success,
    message,
    ...(isDevEnv && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};