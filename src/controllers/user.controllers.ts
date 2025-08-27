import { User } from "../models/user.models";
import { ApiError } from "../libs/apiError";
import { apiResponse } from "../libs/apiResponse";
import { asyncHandler } from "../libs/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { verify } from "../libs/jwt";
import { envConfig } from "../config/envConfig";

// Create User --------------------
const createUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password } = req.body;


  // check if user already exitst
  const isExistedUser = await User.findOne({ email });
  if (isExistedUser?._id) {
    throw new ApiError('User already exists with this email!', 409);
  };

  // create user
  const userRes = await User.create({
    fullName,
    email,
    password
  });

  // Check if the user is created
  if (!userRes._id) {
    throw new ApiError('User not created! Try again.', 500);
  }

  // create tokens
  const accessToken: string = await userRes.createAccessToken();
  const refreshToken: string = await userRes.createRefreshToken();

  // save tokens to database
  userRes.refreshToken = refreshToken;
  await userRes.save({ validateBeforeSave: false });

  // delete the password before send to api
  const userObj = userRes.toObject() as Record<string, any>;
  delete userObj.password;

  const accessOption = {
    httpOnly: true,
    secure: true,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
  };

  const refreshOption = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  };

  return res.status(201)
    .cookie('accessToken', accessToken, accessOption)
    .cookie('refreshToken', refreshToken, refreshOption)
    .json(apiResponse('User created successfuly.', 201, { ...userObj, accessToken, refreshToken }));
});

// Login User --------------------
const loginUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  // check if user already exitst
  const userRes = await User.findOne({ email });
  if (!userRes) {
    throw new ApiError('Invalid Email!', 400);
  };

  // check if the password is correct
  const isPassMatch: boolean = await userRes.comparePassword(password);
  if (!isPassMatch) {
    throw new ApiError('Password doesnot match!', 400);
  };

  // create tokens
  const accessToken: string = await userRes.createAccessToken();
  const refreshToken: string = await userRes.createRefreshToken();

  // save tokens to database
  userRes.refreshToken = refreshToken;
  await userRes.save({ validateBeforeSave: false });

  // delete the password before send to api
  const userObj = userRes.toObject() as Record<string, any>;
  delete userObj.password;

  const accessOption = {
    httpOnly: true,
    secure: true,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
  };

  const refreshOption = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  };

  return res.status(202)
    .cookie('accessToken', accessToken, accessOption)
    .cookie('refreshToken', refreshToken, refreshOption)
    .json(apiResponse('User logged in successfuly.', 202, { ...userObj, accessToken, refreshToken }));
});

// Logout User ------------------
const logoutUser = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id } = (req as any).user;

  const userRes = await User.findOneAndUpdate(
    _id,
    {
      $set: {
        refreshToken: null,
      }
    },
    {
      new: true
    }
  );

  if (!userRes) {
    throw new ApiError('No user to logout!', 500);
  };

  return res.status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(apiResponse('Logout successfuly.', 200));
});

// Get User --------------------
const authStatus = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(200)
      .json(apiResponse('Unathorized!', 401, { userRes: null, isAuthenticated: false }));
  };

  const decodedToken = await verify(accessToken, envConfig.accessSecret);

  const userRes = await User.findById(decodedToken.sub).select('-password -refreshToken -createdAt -updatedAt -__v');
  if (!userRes) {
    throw new ApiError('No user found!', 404);
  };

  return res.status(200)
    .json(apiResponse('Authorized.', 401, { userRes, isAuthenticated: true }));
});

// Refresh access token -------------------
const renewAccessToken = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError('Unathorized!', 401);
  };

  const deocdedToken = await verify(refreshToken, envConfig.refreshSecret);

  const userRes = await User.findById(deocdedToken.sub);
  if (!userRes) {
    throw new ApiError('No user found!', 404);
  };

  if (refreshToken != userRes.refreshToken) {
    throw new ApiError('Expired refresh token!', 401);
  };

  // create tokens
  const accessToken: string = await userRes.createAccessToken();
  const newRefreshToken: string = await userRes.createRefreshToken();

  // save tokens to database
  userRes.refreshToken = newRefreshToken;
  await userRes.save({ validateBeforeSave: false });

  const accessOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1d
  };

  const refreshOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  };

  return res.status(200)
    .cookie('accessToken', accessToken, accessOption)
    .cookie('refreshToken', newRefreshToken, refreshOption)
    .json(apiResponse('Successfuly renew refresh token.', 200));
});

export {
  createUser,
  loginUser,
  logoutUser,
  authStatus,
  renewAccessToken,
};