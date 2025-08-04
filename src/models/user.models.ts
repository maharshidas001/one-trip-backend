import mongoose, { Document, Model, Schema } from "mongoose";
import { AppError } from "../utils/appError.js";
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { envConfig } from "../config/envConfig.js";

interface IUserSchema extends Document {
  fullName: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
  createAccessToken: () => string;
  createRefreshToken: () => string;
};

interface IUserModel extends Model<IUserSchema> {
  renewAccessToken(refreshToken: string): Promise<string | null>;
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
    min: 6
  }
}, { timestamps: true });

// Mongoose Middlewares
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified(this.password)) return next();

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
userSchema.methods.createAccessToken = function (): string {
  return jwt.sign(
    { sub: this._id.toString(), email: this.email }, envConfig.accessSecret, { expiresIn: envConfig.accessExpiry as any }
  )
};

// Create refresh token
userSchema.methods.createRefreshToken = function (): string {
  return jwt.sign(
    { sub: this._id.toString() }, envConfig.refreshSecret, { expiresIn: envConfig.refreshExpiry as any }
  );
};

// Renew Access Token
userSchema.statics.renewAccessToken = async function (refreshToken: string): Promise<string | null> {
  try {
    const payload = jwt.verify(refreshToken, envConfig.refreshSecret) as { sub: string };

    const user = await this.findById(payload.sub);
    if (!user._id) return null;

    return jwt.sign({ sub: payload.sub }, envConfig.accessSecret, { expiresIn: envConfig.accessExpiry as any })
  } catch (error) {
    if (envConfig.nodeEnv == 'development') console.log("JWT Error:", error);
    return null;
  }
};

export const User = mongoose.model<IUserSchema, IUserModel>("User", userSchema);