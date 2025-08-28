import { ApiError } from "../libs/apiError";
import { apiResponse } from "../libs/apiResponse";
import { asyncHandler } from "../libs/asyncHandler";
import type { NextFunction, Request, Response } from "express";
import { Trip } from "../models/trip.models";
import { generateTrip } from "../services/genai";
import type { TripRequest } from "../types/interfaces";
import { getDestinationImage } from "../services/image";

// Get all trips
const getAllTrips = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = (req as any).user;

  try {
    const tripRes = await Trip.find({
      createdBy: _id,
    });

    return res.status(200).json(
      apiResponse('Trips fetched successfully.', 200, tripRes)
    );
  } catch (error) {
    throw new ApiError('Failed to fetch trips.', 500, error);
  }
});

// Get single trip
const getSingleTrip = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { _id } = (req as any).user;

  try {
    const trip = await Trip.findOne({ _id: id, createdBy: _id });

    if (!trip?._id) {
      throw new ApiError('Trip not found.', 404);
    }

    return res.status(200).json(
      apiResponse('Trip fetched successfully.', 200, trip)
    );
  } catch (error) {
    throw new ApiError('Failed to fetch trip.', 500, error);
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
  const { _id } = (req as any).user;

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
      createdBy: _id,
      imageUrl,
      foodPreferance, stay, travelType, travelingWith, travlerCount,
    });
    await newTrip.save();

    return res.status(200).json(apiResponse('Trip generated successfuly.', 200, { newTrip }));
  } catch (error) {
    throw new ApiError('Trip Generation failed! Try again.', 500, error);
  }
});

// Delete trip
const deleteTrip = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { _id } = (req as any).user;

  try {
    const trip = await Trip.findOneAndDelete({ _id: id, createdBy: _id });

    if (!trip?._id) {
      throw new ApiError('Trip not found.', 404);
    }

    return res.status(200).json(
      apiResponse('Trip deleted successfully.', 200, trip)
    );
  } catch (error) {
    throw new ApiError('Failed to delete trip.', 500, error);
  }
});

export {
  getAllTrips,
  getSingleTrip,
  createTrip,
  deleteTrip
};