import express from "express";
import { registerUser, loginUser, logoutUser, refreshToken } from "../controllers/auth.controller.js"
import { authLimiter } from "../middleware/rateLimit.middleware.js";    

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

export default router;
