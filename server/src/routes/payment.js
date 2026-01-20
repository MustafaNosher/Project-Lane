import express from "express";
import {
  createCheckOutSession,
  getCheckoutSessionDetails,
  handleStripeWebhook,
  createCustomerPortal,
} from "../controllers/payment.controller.js";
import protect from "../middleware/auth.middleware.js";
import { sensitiveActionLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  protect,
  sensitiveActionLimiter,
  createCheckOutSession
);
router.post(
    "/create-portal-session",
    protect,
    sensitiveActionLimiter,
    createCustomerPortal
);
router.get(
  "/checkout-session/:sessionId",
  protect,
  getCheckoutSessionDetails
);

router.post("/webhook", handleStripeWebhook);

export default router;
