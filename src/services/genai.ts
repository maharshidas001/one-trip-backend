import { GoogleGenAI } from "@google/genai";
import { envConfig } from "../config/envConfig.js";
import { tripPrompt } from "../config/tripPlannerPrompt.js";
import type { TripRequest } from "../types/interface.js";

const genAi = new GoogleGenAI({
  apiKey: envConfig.geminiKey,
});

const generateTrip = async (userDetails: TripRequest) => {
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