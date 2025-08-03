import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

// Package middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

export default app;