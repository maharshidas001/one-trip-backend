import { GoogleGenAI } from "@google/genai";
import { envConfig } from "../config/envConfig";
import { tripPrompt } from "../config/tripPlannerPrompt";
import type { TripRequest } from "../types/interfaces";

// Initialize GenAI
const genAi = new GoogleGenAI({
  apiKey: envConfig.geminiKey,
});

// Generate Trip
const generateTrip = async (userDetails: TripRequest) => {
  // get the completed prompt
  const completedPrompt: string = tripPrompt(userDetails);

  const response = await genAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: completedPrompt,
    config: {
      responseMimeType: "application/json",
    }
  })

  return response;
};

export { generateTrip };