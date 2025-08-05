import { Router } from "express";
import { registerUser, loginUser, logoutUser, authStatus } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.route('/create').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').get(logoutUser);
userRouter.route('/auth-status').get(authMiddleware, authStatus);

export { userRouter };