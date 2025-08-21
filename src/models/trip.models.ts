import mongoose, { Document, Schema } from "mongoose";
import type { TripItinerary } from "../types/interfaces";

interface ITripSchema extends TripItinerary, Document { };

const tripSchema = new Schema<ITripSchema>({
  createdBy: {
    type: String,
    required: true
  },
  tripTitle: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  dailyPlan: [
    {
      day: {
        type: Number,
        required: true
      },
      date: {
        type: String,
        required: true
      },
      activities: [
        {
          time: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          },
          location: {
            type: String,
            required: true
          },
          ticketPrice: {
            type: Number,
            required: true,
          }
        }
      ],
    }
  ],
  budgetBreakdown: {
    category: {
      type: String,
      required: true,
    },
    estimateCost: {
      type: String,
      required: true,
    },
  },
  travelingWith: {
    type: String,
    required: true,
  },
  travelType: {
    type: String,
    required: true,
  },
  travlerCount: {
    type: Number,
    required: true,
  },
  stay: {
    type: String,
    required: true,
  },
  foodPreferance: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Trip = mongoose.model<ITripSchema>("Trip", tripSchema);