import express from "express";

import { getUserProfile, updateUserProfile, updatePassword, getAllUsers, getDashboardStats } from "../controllers/user.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { parseFormData } from "../middleware/multer-middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.get("/", authMiddleware, getAllUsers);
router.get("/stats", authMiddleware, getDashboardStats);
router.put("/profile", authMiddleware, parseFormData, updateUserProfile);
router.put("/change-password", authMiddleware, parseFormData, updatePassword);

export default router;
