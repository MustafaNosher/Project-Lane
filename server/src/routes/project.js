import express from "express";
import { createProject , getProjectDetails , getProjectTasks, updateProject} from "../controllers/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { parseFormData } from "../middleware/multer-middleware.js";

const router = express.Router();

router.post("/create/:workspaceId" , authMiddleware , parseFormData , createProject);
router.get("/details/:projectId" , authMiddleware , parseFormData , getProjectDetails);
router.get("/tasks/:projectId" , authMiddleware , parseFormData , getProjectTasks);
router.patch("/:projectId", authMiddleware, parseFormData, updateProject);

export default router;