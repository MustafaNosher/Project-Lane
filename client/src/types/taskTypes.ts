import type { User } from "./authTypes";

export interface SubTask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  task: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Attachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string | User;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string; // Project ID
  status: "To Do" | "In Progress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
  assignees: User[];
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  attachments: Attachment[];
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assignees?: string[];
}
