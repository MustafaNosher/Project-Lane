
import type { User } from "./authTypes";

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    color: string;
    owner: string;
    members: {
        user: User;
        role: 'owner' | 'admin' | 'member' | 'guest';
        joinedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceState {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;
}

export interface CreateWorkspacePayload {
    name: string;
    description?: string;
    color: string;
}

export interface WorkspaceResponse {
    success: boolean;
    message: string;
    data: Workspace | Workspace[]; 
}
