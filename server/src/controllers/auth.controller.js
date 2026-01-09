import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";

const registerUser = async (req, res) => {
  // Validate request body
  const errorMsg = validateRequestBody(req.body, ["email", "name", "password"]);
  if (errorMsg) return errorResponse(res, 400, errorMsg);

  try {
    const { email, name, password } = req.body;

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

    return successResponse(
      res,
      201,
      "User registered successfully",
      {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture
      }
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const loginUser = async (req, res) => {
  // Validate request body
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

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userData = user.toObject();
    delete userData.password;

    return successResponse(
      res,
      200,
      "Login successful",
      { token, user: userData }
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const logoutUser = async (req, res) => {
  try {
    return successResponse(res, 200, "Logged out successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export {
  registerUser,
  loginUser,
  logoutUser
};
