import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const subscriptionMiddleware = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sub } = (req as any).user;

  try {
    const user = await User.findById(sub);

    if (!user) {
      throw new AppError('No user found!', 404);
    }

    if (user.subscriptionStatus === 'active' && user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd > new Date()) {
      return next();
    }

    if (user.subscriptionStatus === 'active' && user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd <= new Date()) {
      user.subscriptionStatus = 'free';
      await user.save();

      return next();
    }

    if (user.availableFreeLimit <= 0) {
      throw new AppError('Free trips exhausted', 400);
    }

    next();
  } catch (error) {
    console.log('Subs middleware error', error);
    throw new AppError('Subscription Error', 500);
  }
});