import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { envConfig } from "../config/envConfig.js";
import { verify } from '../utils/jwt.js';
import { asyncHandler } from "../utils/asyncHandler.js";

export const authMiddleware = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get access token from cookie
  const { accessToken } = req.cookies;

  if (!accessToken) throw new AppError('Unauthorised!', 401);

  try {
    const decoded = await verify(accessToken, envConfig.accessSecret!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    throw new AppError("Access token expired or invalid", 403);
  }
});