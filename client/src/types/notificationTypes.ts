export interface Notification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    type: "mention" | "assignment" | "project_invite";
    referenceId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}
