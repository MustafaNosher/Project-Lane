import express from "express";
import { createProject , getProjectDetails , getProjectTasks, updateProject, deleteProject, addProjectMember} from "../controllers/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { parseFormData } from "../middleware/multer-middleware.js";

const router = express.Router();

router.post("/create/:workspaceId" , authMiddleware , parseFormData , createProject);
router.get("/details/:projectId" , authMiddleware , parseFormData , getProjectDetails);
router.get("/tasks/:projectId" , authMiddleware , parseFormData , getProjectTasks);
router.patch("/:projectId", authMiddleware, parseFormData, updateProject);
router.patch("/:projectId/members", authMiddleware, parseFormData, addProjectMember);
router.delete("/:projectId", authMiddleware, parseFormData, deleteProject);

export default router;