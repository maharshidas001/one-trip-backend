import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app = express();

// Package middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Global error handler
app.use(globalErrorHandler);

export default app;