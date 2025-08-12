import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

// Custom
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app = express();

// Package middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
import { homeRouter } from "./routers/home.routes.js";
import { userRouter } from "./routers/user.routes.js";
import { tripRouter } from "./routers/trip.routes.js";

app.use('/api/v1', homeRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/trip', tripRouter);

// Global error handler (always in the last to catch every error)
app.use(globalErrorHandler);

export default app;