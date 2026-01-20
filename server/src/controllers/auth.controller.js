import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, purpose: "login" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } 
  );
  
  const refreshToken = jwt.sign(
    { userId, purpose: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const setTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const registerUser = async (req, res) => {
  const errorMsg = validateRequestBody(req.body, ["email", "name", "password", "confirmPassword"]);
  if (errorMsg) return errorResponse(res, 400, errorMsg);

  try {
    const { email, name, password, confirmPassword } = req.body;

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Invalid email address");
    }

    if (password.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      return errorResponse(res, 400, "Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email address already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name,
    });

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    setTokenCookie(res, refreshToken);



    return successResponse(
      res,
      201,
      "User registered successfully",
      {
        token: accessToken,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        isPaid: newUser.isPaid,
        plan: newUser.plan,
        stripeCustomerId: newUser.stripeCustomerId,
        stripeSubscriptionId: newUser.stripeSubscriptionId,
        stripeSessionId: newUser.stripeSessionId
      }
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const loginUser = async (req, res) => {
  const errorMsg = validateRequestBody(req.body, ["email", "password"]);
  if (errorMsg) return errorResponse(res, 400, errorMsg);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    setTokenCookie(res, refreshToken);

    const userData = user.toObject();
    delete userData.password;

    return successResponse(
      res,
      200,
      "Login successful",
      { token: accessToken, user: userData }
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return successResponse(res, 200, "Logged out successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return errorResponse(res, 401, "No refresh token provided");
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        if (decoded.purpose !== "refresh") {
             return errorResponse(res, 403, "Invalid token purpose");
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return errorResponse(res, 401, "User not found");
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        
        setTokenCookie(res, newRefreshToken); 

        return successResponse(res, 200, "Token refreshed", { token: accessToken });

    } catch (error) {
        console.log("Refresh Token Error:", error.message);
        return errorResponse(res, 403, "Invalid or expired refresh token");
    }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
};
