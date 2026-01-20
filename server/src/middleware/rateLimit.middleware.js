import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Limiter for auth routes (15 mins window, 10 attempts)
export const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts , please try again after 15 minutes"
);

// General limiter for sensitive actions (1 min window, 5 attempts)
export const sensitiveActionLimiter = createRateLimiter(
  60 * 1000,
  5,
  "Too many requests, please slow down"
);
