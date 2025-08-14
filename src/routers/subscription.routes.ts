import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { subscriptionMiddleware } from "../middlewares/subscriptionMiddleware.js";
import { createSubscriptionSession, getSubscriptionDetails, webhook } from "../controllers/subscription.controllers.js";

const subscriptionRouter = Router();

subscriptionRouter.route('/stripe').post(authMiddleware, webhook);
subscriptionRouter.route('/stripe-session').post(authMiddleware, subscriptionMiddleware, createSubscriptionSession);
subscriptionRouter.route('/stripe-details').post(authMiddleware, getSubscriptionDetails);

export { subscriptionRouter };