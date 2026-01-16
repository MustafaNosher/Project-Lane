import express from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  addWorkspaceMember,
  deleteWorkspace
} from "../controllers/workspace.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.post("/:workspaceId/members", authMiddleware, addWorkspaceMember);
router.delete("/:workspaceId", authMiddleware, deleteWorkspace);

export default router;
