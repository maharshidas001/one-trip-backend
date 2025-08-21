import { Router } from "express";
import { apiResponse } from "../libs/apiResponse";

const homeRouter = Router();

homeRouter.route('/').get((_, res) => {
  res.status(200).json(apiResponse('Welcome to One Trip API.', 200, {}));
});

export { homeRouter };