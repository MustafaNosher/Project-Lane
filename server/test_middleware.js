import express from "express";
import authRoutes from "./src/routes/auth.js";
import authMiddleware from "./src/middleware/auth.middleware.js";

const app = express();
app.use("/api/auth", authRoutes);

console.log("Middleware and routes imported successfully");
if (typeof authMiddleware === 'function') {
    console.log("authMiddleware is a function");
} else {
    console.error("authMiddleware is NOT a function");
    process.exit(1);
}
