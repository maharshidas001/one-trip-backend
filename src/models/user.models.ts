import mongoose, { Document, Schema } from "mongoose";
import type { IUserMongooseModel } from "../types/interfaces";
import { ApiError } from "../libs/apiError";
import bcrypt from "bcrypt";
import { sign } from "../libs/jwt";
import { envConfig } from "../config/envConfig";

const userSchema = new Schema<IUserMongooseModel, Document>({
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: 6
  },
  refreshToken: {
    type: String,
    required: true,
    default: null
  },
}, { timestamps: true });

// Mongoose Middlewares
// Hash password before saving
userSchema.pre('save', (async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new ApiError('Error while hasing the password!', 500))
  }
}));

// Custom :: Methods

// Compare the password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Create Access token
userSchema.methods.createAccessToken = async function (): Promise<string> {
  return await sign(
    { sub: this._id.toString(), email: this.email }, envConfig.accessSecret, { expiresIn: envConfig.accessExpiry }
  )
};

// Create refresh token
userSchema.methods.createRefreshToken = async function (): Promise<string> {
  return await sign(
    { sub: this._id.toString() }, envConfig.refreshSecret, { expiresIn: envConfig.refreshExpiry }
  );
};

export const User = mongoose.model<IUserMongooseModel, Document>("User", userSchema);