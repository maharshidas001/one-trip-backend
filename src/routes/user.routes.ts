import { Router } from "express";
import { authStatus, createUser, loginUser, logoutUser, renewAccessToken } from "../controllers/user.controllers";
import { verifyToken } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.route('/create').post(createUser);
userRouter.route('/login').post(loginUser);

// Secured Routes
userRouter.route('/logout').get(verifyToken, logoutUser);
userRouter.route('/auth-status').get(verifyToken, authStatus);
userRouter.route('/renew-refresh-token').get(renewAccessToken);

export { userRouter };