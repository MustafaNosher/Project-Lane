import User from "../models/user.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";

const getUserProfile = async (req, res)=>{
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return errorResponse(res, 404, "User not found");
        }
        return successResponse(res, 200, "User profile fetched successfully", user);

    }catch(error){

        console.error("Error in Fetching User Profile:", error);
        return errorResponse(res, 500, "Internal server error");
    }
} 

const updateUserProfile = async (req, res) => {
  try {

    const errorMsg = validateRequestBody(req.body);

    if (errorMsg) return errorResponse(res, 400, errorMsg);

    const { name, email, profilePicture } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return errorResponse(res, 400, "Email already in use");
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    return successResponse(res, 200, "User profile updated successfully", user);

  } catch (error) {
    console.error("Error in Updating User Profile:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


const updatePassword = async (req, res) => {

  try {
    const errorMsg = validateRequestBody(req.body, ["oldPassword", "newPassword"]);
    if (errorMsg) return errorResponse(res, 400, errorMsg);

    const { oldPassword, newPassword } = req.body;

     if (newPassword.length < 6) {

      return errorResponse(res, 400, "New password must be at least 6 characters long");
    }

    const user = await User.findById(req.user._id).select("+password"); // Ensure password is selected

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        
      return errorResponse(res, 400, "Invalid old password");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return successResponse(res, 200, "Password updated successfully", userData);
  } catch (error) {
    console.error("Error in Updating Password:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name email profilePicture");
    return successResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error("Error in Fetching All Users:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [activeProjectsCount, pendingTasksCount] = await Promise.all([
      Project.countDocuments({ "members.user": userId }),
      Task.countDocuments({ assignees: userId, status: { $ne: "Done" } }),
    ]);

    return successResponse(res, 200, "Dashboard stats fetched successfully", {
      activeProjectsCount,
      pendingTasksCount,
    });
  } catch (error) {
    console.error("Error in Fetching Dashboard Stats:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export {
    getUserProfile,
    updateUserProfile,
    updatePassword,
    getAllUsers,
    getDashboardStats
}