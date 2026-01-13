import type { User } from "./authTypes";

export interface ProjectTask {
  _id: string;
  status: "To Do" | "In Progress" | "Need Info" | "Completed" | "Cancelled";
}

export interface ProjectMember {
  user: User;
  role: "manager" | "contributor" | "viewer";
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  workspace: string; // Workspace ID
  status: "Planning" | "In Progress" | "Need Info" | "Completed" | "Cancelled";
  startDate?: string;
  dueDate?: string;
  progress: number;
  tasks: ProjectTask[]; // Only populated with partial data usually, or IDs
  members: ProjectMember[];
  tags: string[];
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  status?: string;
  startDate?: string;
  dueDate?: string;
  members?: string[]; // Array of User IDs to add
  tags?: string; // Comma separated string for input
}
