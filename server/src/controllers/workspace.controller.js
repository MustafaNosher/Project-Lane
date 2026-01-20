import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import Task from "../models/task.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";
import Comment from "../models/comment.js";

const createWorkspace = async (req, res) => {
  try {
     const errorMsg = validateRequestBody(req.body, ["name", "color"]);

     if (errorMsg) return errorResponse(res, 400, errorMsg);
     
     const { name, description, color } = req.body;
     
     const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });
    return successResponse(res, 201, "Workspace created successfully", workspace);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, "Workspaces fetched successfully", workspaces);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
        return errorResponse(res, 404, "Workspace not found");
    }

    return successResponse(res, 200, "Workspace details fetched successfully", workspace);
  } catch (error) {
      console.log(error);
      return errorResponse(res, 500, "Internal server error");
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: req.user._id },
        { "members.user": req.user._id }
      ]
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
        return errorResponse(res, 404, "Workspace not found");
    }

    const projects = await Project.find({
      workspace: workspaceId,
      members: { $elemMatch: { user: req.user._id } },
    })
      .populate("tasks", "status")
      .populate("members.user", "name profilePicture")
      .sort({ createdAt: -1 });

    // Self-healing: Ensure workspace.projects only contains existing project IDs
    const projectIds = projects.map(p => p._id.toString());
    const needsCleanup = workspace.projects.some(id => !projectIds.includes(id.toString()));
    
    if (needsCleanup) {
      workspace.projects = workspace.projects.filter(id => projectIds.includes(id.toString()));
      await workspace.save();
    }

    return successResponse(res, 200, "Workspace projects fetched successfully", { projects, workspace });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const addWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return errorResponse(res, 404, "Workspace not found");
    }

    // Check if the current user is the owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, "Only the workspace owner can add members");
    }

    // Check if the user to be added exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return errorResponse(res, 404, "User not found");
    }

    // Check if the user is already a member
    const isAlreadyMember = workspace.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return errorResponse(res, 400, "User is already a member of this workspace");
    }

    // Add the new member
    workspace.members.push({
      user: userId,
      role: role || "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    const populatedWorkspace = await Workspace.findById(workspaceId).populate("members.user", "name email profilePicture");

    return successResponse(res, 200, "Member added successfully", populatedWorkspace);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};


const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return errorResponse(res, 404, "Workspace not found");
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, "Only the workspace owner can delete the workspace");
    }
    // Find all projects associated with this workspace
    const projects = await Project.find({ workspace: workspaceId });
    const projectIds = projects.map(project => project._id);

    console.log(`Found ${projectIds.length} projects to delete for workspace ${workspaceId}`);

    if (projectIds.length > 0) {
      // Find all tasks associated with these projects
      const tasks = await Task.find({ project: { $in: projectIds } });
      const taskIds = tasks.map(task => task._id);

      console.log(`Found ${taskIds.length} tasks to delete`);

      if (taskIds.length > 0) {
        // Delete all comments associated with these tasks
        const deleteCommentsResult = await Comment.deleteMany({ task: { $in: taskIds } });
        console.log(`Deleted ${deleteCommentsResult.deletedCount} comments`);
      }

      // Delete all tasks
      const deleteTasksResult = await Task.deleteMany({ project: { $in: projectIds } });
      console.log(`Deleted ${deleteTasksResult.deletedCount} tasks`);
    }

    // Delete all projects
    const deleteProjectsResult = await Project.deleteMany({ workspace: workspaceId });
    console.log(`Deleted ${deleteProjectsResult.deletedCount} projects`);

    // Delete the workspace itself
    await Workspace.findByIdAndDelete(workspaceId);

    return successResponse(res, 200, "Workspace and all associated projects and tasks deleted successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  addWorkspaceMember,
  deleteWorkspace,
};