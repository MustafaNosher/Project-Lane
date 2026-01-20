import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { parseFormData } from "../middleware/multer-middleware.js";

import { 
    createTask, 
    updateTaskTitle,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskAssignees,
    updateTaskPriority,
    addSubTask,
    updateSubTask,
    addComment,
    getMyTasks,
    uploadAttachment,
    getTaskById
} from "../controllers/task.controller.js";
import { upload } from "../libs/multer.js";

const router = express.Router();

router.get("/my-tasks" , authMiddleware , getMyTasks);
router.post("/create/:projectId" , authMiddleware , parseFormData , createTask);
router.get("/:taskId" , authMiddleware , getTaskById);
router.patch("/:taskId/title" , authMiddleware , parseFormData, updateTaskTitle);
router.patch("/:taskId/description" , authMiddleware , parseFormData, updateTaskDescription);
router.patch("/:taskId/status" , authMiddleware , parseFormData, updateTaskStatus);
router.patch("/:taskId/assignees" , authMiddleware , parseFormData, updateTaskAssignees);
router.patch("/:taskId/priority" , authMiddleware , parseFormData, updateTaskPriority);
router.post("/:taskId/subtasks" , authMiddleware , parseFormData, addSubTask);
router.post("/:taskId/comments" , authMiddleware , parseFormData, addComment);
router.patch("/:taskId/subtasks/:subtaskId" , authMiddleware , parseFormData, updateSubTask);
router.post("/:taskId/attachments", authMiddleware, upload.single("attachment"), uploadAttachment);


export default router;