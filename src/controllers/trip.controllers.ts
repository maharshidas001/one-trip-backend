import { AppError } from "../utils/appError.js";
import { successResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/envConfig.js";
import { Trip } from "../models/trip.models.js";
import { generateTrip } from "../services/genai.js";
import type { TripItinerary, TripRequest } from "../types/interface.js";
import { getDestinationImage } from "../services/image.js";

// Get all trips
const getAllTrips = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sub } = (req as any).user;

  try {
    const tripRes = await Trip.find({
      createdBy: sub,
    });

    res.status(200).json(
      successResponse('Trips fetched successfully.', 200, tripRes)
    );
  } catch (error) {
    throw new AppError('Failed to fetch trips.', 500, error);
  }
});

// Get single trip
const getSingleTrip = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { sub } = (req as any).user;

  try {
    const trip = await Trip.findOne({ _id: id, createdBy: sub });

    if (!trip?._id) {
      throw new AppError('Trip not found.', 404);
    }

    res.status(200).json(
      successResponse('Trip fetched successfully.', 200, trip)
    );
  } catch (error) {
    throw new AppError('Failed to fetch trip.', 500, error);
  }
});

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
    // get the destination image
    const imageUrl: string = await getDestinationImage(destination);

    // generate the trip
    const generatedTrip = await generateTrip({ budget, dateRange, destination, foodPreferance, stay, travelType, travelingWith, travlerCount });
    // parse the trip
    const completeGeneratedTrip = JSON.parse(generatedTrip.text!);

    // save the trip
    const newTrip = new Trip({
      ...completeGeneratedTrip,
      createdBy: sub,
      imageUrl,
    });
    await newTrip.save();

    res.status(200).json(successResponse('Trip generated successfuly.', 200, { completeGeneratedTrip, createdBy: sub }));
  } catch (error) {
    console.log('Trip Generation failed! Try again.')
    throw new AppError('Trip Generation failed! Try again.', 500, error);
  }
});

// Delete trip
const deleteTrip = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { sub } = (req as any).user;

  try {
    const trip = await Trip.findOneAndDelete({ _id: id, createdBy: sub });

    if (!trip?._id) {
      throw new AppError('Trip not found.', 404);
    }

    res.status(200).json(
      successResponse('Trip deleted successfully.', 200, trip)
    );
  } catch (error) {
    throw new AppError('Failed to delete trip.', 500, error);
  }
});

export {
  getAllTrips,
  getSingleTrip,
  createTrip,
  deleteTrip
};