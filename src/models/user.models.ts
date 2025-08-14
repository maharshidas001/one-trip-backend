import mongoose, { Document, Schema } from "mongoose";
import { AppError } from "../utils/appError.js";
import bcrypt from 'bcrypt';
import { sign } from '../utils/jwt.js';
import { envConfig } from "../config/envConfig.js";
import type { IUserSubscription } from "../types/interface.js";

interface IUserSchema extends IUserSubscription, Document {
  fullName: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  isSubscribed: boolean;
  availableFreeLimit: number;
  comparePassword: (password: string) => Promise<boolean>;
  createAccessToken: () => string;
  createRefreshToken: () => string;
};

const userSchema = new Schema<IUserSchema>({
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
  accessToken: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  availableFreeLimit: {
    type: Number,
    default: 5,
    min: 0,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  stripeSubscriptionId: {
    type: String,
  },
  stripePriceId: {
    type: String,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'active', 'canceled', 'past_due'],
    default: 'free'
  },
}, { timestamps: true });

// Mongoose Middlewares
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new AppError('Error while hasing the password!', 500))
  }
});

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

export const User = mongoose.model<IUserSchema>("User", userSchema);