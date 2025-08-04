import mongoose, { Document, Schema } from "mongoose";

interface IUserSchema extends Document {
  fullName: string;
  email: string;
  password: string;
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

export const User = mongoose.model("User", userSchema);