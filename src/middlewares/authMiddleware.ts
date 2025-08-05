import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import { envConfig } from "../config/envConfig.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // get access token from cookie
  const { accessToken } = req.cookies;

  if (!accessToken) throw new AppError('Unauthorised!', 401);

  try {
    const decoded = jwt.verify(accessToken, envConfig.accessSecret!);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Access token expired or invalid", 403);
  }
};