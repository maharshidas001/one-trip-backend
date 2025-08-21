import { Router } from "express";
import { createTrip, getAllTrips, getSingleTrip, deleteTrip } from "../controllers/trip.controllers";
import { verifyToken } from "../middlewares/auth.middleware";

const tripRouter = Router();

tripRouter.route('/all-trips').get(verifyToken, getAllTrips);
tripRouter.route('/:id').get(verifyToken, getSingleTrip);
tripRouter.route('/create').post(verifyToken, createTrip);
tripRouter.route('/delete/:id').delete(verifyToken, deleteTrip);

export { tripRouter };