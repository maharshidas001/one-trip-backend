import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Custom
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { envConfig } from "./config/envConfig";

const app = express();

// Package middlewares
app.use(cors({
  origin: envConfig.frontendUrl,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import { homeRouter } from "./routes/home.routes";
import { userRouter } from "./routes/user.routes";

app.use('/api/v1', homeRouter);
app.use('/api/v1/user', userRouter);

// Global error handler (always in the last to catch every error)
app.use(globalErrorHandler);

export default app;