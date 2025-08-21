import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../libs/apiError";
import { envConfig } from "../config/envConfig";
import { verify } from '../libs/jwt';
import { asyncHandler } from "../libs/asyncHandler";
import { User } from "../models/user.models";

export const verifyToken = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies || req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) throw new ApiError('Unauthorised!', 401);

  try {
    const decoded = await verify(accessToken, envConfig.accessSecret);

    const userRes = await User.findById(decoded.sub);
    if (!userRes) {
      throw new ApiError('Invalid Access token!', 401);
    };

    (req as any).user = userRes;
    next();
  } catch (error) {
    throw new ApiError("Access token expired!", 403);
  }
});