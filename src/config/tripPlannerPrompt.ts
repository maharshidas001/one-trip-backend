import type { TripRequest } from "../types/interfaces";

export const tripPrompt = (tripDetails: TripRequest): string => {
  const { budget, dateRange, destination, foodPreferance, stay, travelType, travelingWith, travlerCount } = tripDetails;
  return `You are a professional travel planner. Create a detailed trip itinerary.
    User's request:
    - Destination: ${destination}
    - Dates: from ${dateRange.startDate} to ${dateRange.endDate}
    - Travel Type: ${travelType}
    - Budget: ${budget}
    - Number of people: ${travlerCount}
    - Traveling With: ${travelingWith}
    - Stay: ${stay}
    - Food: ${foodPreferance}
    
    Your response must be a valid JSON object matching the following structure:
    {
      tripTitle: string,
      destination: string,
      imageUrl: string,
      overview: string,
      dailyPlan: [{
        day: number,
        date: string,
        activities: [{
          time: string,
          description: string,
          location: string,
          ticketPrice: number;
        }],
      }],
      budgetBreakdown: {
        category: string,
        estimateCost: string,
      }
    }`;
};