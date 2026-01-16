import type { ProjectTask } from "@/types/projectTypes";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "png", "jpg", "jpeg"];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const PRESET_COLORS = [
    "#6366f1", // Indigo
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
];

const TASK_STATUS_WEIGHT: Record<ProjectTask['status'], number> = {
  "To Do": 0,
  "In Progress": 0.4,
  "Review": 0.8,
  "Done": 1,
};

export {
    ALLOWED_MIME_TYPES,
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
    PRESET_COLORS,
    TASK_STATUS_WEIGHT
}
