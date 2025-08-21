import { envConfig } from "../config/envConfig";

function encodeSpaces(input: string): string {
  return input.trim().replace(/\s+/g, '%20');
}

export const getDestinationImage = async (destination: string): Promise<string> => {
  const encodedPropmt = encodeSpaces(destination);

  const PROMPT: string = `https://api.unsplash.com/search/photos?query=${encodedPropmt}&client_id=${envConfig.imageKey}&w=1280&h=720&fit=crop`;

  const destinationImage = await fetch(PROMPT);
  const resDestinationImage = await destinationImage.json();

  const exactImageUrl: string = resDestinationImage.results[0].urls.raw;

  return exactImageUrl;
};