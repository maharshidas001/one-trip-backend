import Stripe from "stripe";
import { envConfig } from "../config/envConfig.js";

export const stripe = new Stripe(envConfig.stripeKey, {
  apiVersion: '2025-07-30.basil',
});