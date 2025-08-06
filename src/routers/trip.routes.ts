import { Router } from "express";
import { createTrip } from "../controllers/trip.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const tripRouter = Router();

tripRouter.route('/create').post(authMiddleware, createTrip);

export { tripRouter };