import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { errorResponse } from "../utils/response.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return errorResponse(res, 401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
        return errorResponse(res, 401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
        return errorResponse(res, 401, "Token expired");
    }
    if (error.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid token");
    }
    return errorResponse(res, 500, "Internal server error");
  }
};

export default authMiddleware;