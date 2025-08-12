import { Router } from "express";
import { createTrip, getAllTrips, getSingleTrip, deleteTrip } from "../controllers/trip.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const tripRouter = Router();

tripRouter.route('/all-trips').get(authMiddleware, getAllTrips);
tripRouter.route('/:id').get(authMiddleware, getSingleTrip);
tripRouter.route('/create').post(authMiddleware, createTrip);
tripRouter.route('/delete/:id').delete(authMiddleware, deleteTrip);

export { tripRouter };