import { Router } from "express";
import { successResponse } from "../utils/successResponse.js";

const router = Router();

router.route('/').get((_, res) => {
  res.status(200).json(successResponse('Welcome to One Trip API.', 200, {}));
});

export { router as homeRouter };