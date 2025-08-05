import { AppError } from "../utils/appError.js";
import { User } from "../models/user.models.js";
import { successResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/envConfig.js";
import jwt from "jsonwebtoken";

// Register User -------------------
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
  });

  // Check if the user is created
  if (!userRes._id) {
    throw new AppError('User not created! Try again.', 500);
  }

  // create tokens
  const accessToken: string = userRes.createAccessToken();
  const refreshToken: string = userRes.createRefreshToken();

  // save tokens to database
  userRes.accessToken = accessToken;
  userRes.refreshToken = refreshToken;
  await userRes.save();

  // save tokens as cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: envConfig.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: envConfig.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  // delete the password before send to api
  const userObj = userRes.toObject() as Record<string, any>;
  delete userObj.password;

  res.status(201).json(successResponse('User created successfuly.', 201, { ...userObj, accessToken, refreshToken }));
});

// Login -----------------------
const loginUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // clear all cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // check if user already exitst
  const userRes = await User.findOne({ email });
  if (!userRes?._id) {
    throw new AppError('Invalid Email!', 400);
  }

  // check if the password is correct
  const isPassMatch: boolean = await userRes.comparePassword(password);
  if (!isPassMatch) {
    throw new AppError('Password doesnot match!', 400);
  }

  // create tokens
  const accessToken: string = userRes.createAccessToken();
  const refreshToken: string = userRes.createRefreshToken();

  // save tokens to database
  userRes.accessToken = accessToken;
  userRes.refreshToken = refreshToken;
  await userRes.save();

  // save tokens as cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: envConfig.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: envConfig.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  // delete the password before send to api
  const userObj = userRes.toObject() as Record<string, any>;
  delete userObj.password;

  res.status(202).json(successResponse('User logged in successfuly.', 202, { ...userObj, accessToken, refreshToken }));
});

// Logout -----------------------
const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json(successResponse("Logged out", 200));
};

// Check if user is authenticated
const authStatus = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(successResponse('User is Authenticated', 200, { isAuthenticated: true }));
})

export {
  registerUser,
  loginUser,
  logoutUser,
  authStatus,
};