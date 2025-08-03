import mongoose from "mongoose";
import { envConfig } from "../config/envConfig.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(envConfig.mongodbUri as string);

    console.log(`\nDatabase connected: ${res.connection.host}`);
  } catch (error) {
    console.log("Database connection failed!");

    process.exit(1);
  }
};

export default connectDB;