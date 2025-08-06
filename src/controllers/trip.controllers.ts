import { AppError } from "../utils/appError.js";
import { successResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/envConfig.js";
import { Trip } from "../models/trip.models.js";
import { generateTrip } from "../services/genai.js";
import type { TripItinerary, TripRequest } from "../types/interface.js";

// Create Trip
const createTrip = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { budget, dateRange, destination, foodPreferance, stay, travelType, travelingWith, travlerCount }: TripRequest = req.body;

  // Get the user id
  const { sub } = (req as any).user;

  try {
    // generate the trip
    const generatedTrip = await generateTrip({ budget, dateRange, destination, foodPreferance, stay, travelType, travelingWith, travlerCount });
    // parse the trip
    const completeGeneratedTrip: TripItinerary = JSON.parse(generatedTrip.text!);

    // save the trip
    const newTrip = new Trip({
      ...completeGeneratedTrip,
      createdBy: sub
    });
    await newTrip.save();

    res.status(200).json(successResponse('Trip generated successfuly.', 200, { completeGeneratedTrip, createdBy: sub }));
  } catch (error) {
    console.log('Trip Generation failed! Try again.')
    throw new AppError('Trip Generation failed! Try again.', 500, error);
  }
});

export {
  createTrip,
};