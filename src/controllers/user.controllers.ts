import { AppError } from "../utils/appError.js";
import { User } from "../models/user.models.js";
import { successResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction, Request, Response } from "express";

// Register User
const registerUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password } = req.body;

  // check if user already exitst
  const isExistedUser = await User.findOne({ email });
  if (isExistedUser?._id) {
    throw new AppError('User already exists with this email!', 409);
  }

  // create user
  const userRes = await User.create({
    fullName,
    email,
    password
  })

  // Check if the user is created
  if (!userRes._id) {
    throw new AppError('User not created! Try again.', 500);
  }

  res.status(200).json(successResponse('User created successfuly.', 200, userRes));
});

export {
  registerUser
};