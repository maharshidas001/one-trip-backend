import mongoose from "mongoose";
import { envConfig } from "../config/envConfig";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(envConfig.mongodbUri as string);

    console.log(`\nDatabase connected`);
  } catch (error) {
    console.log("Database connection failed!");

    process.exit(1);
  }
};

export default connectDB;