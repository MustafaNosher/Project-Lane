/* FRONTEND ROUTES */

export const ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/signin",
    SIGN_UP: "/auth/signup",
  },
  DASHBOARD: {
    BASE: "/dashboard",
    WORKSPACES: "/dashboard/workspaces",
    MY_TASKS: "/dashboard/my-tasks",
    PROFILE: "/dashboard/profile",
    PAYMENT: "/dashboard/payment",
  }

} as const;

/* BACKEND ROUTES */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_ROUTES = {
  AUTH: {
    LOGIN:`${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  USER: {
    GET_PROFILE: `${API_BASE_URL}/user/profile`,
    GET_ALL: `${API_BASE_URL}/user`,
    GET_STATS: `${API_BASE_URL}/user/stats`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/user/change-password`,
  },
  WORKSPACE: {
    base: `${API_BASE_URL}/workspace`,
    GET_ALL: `${API_BASE_URL}/workspace`,
    CREATE: `${API_BASE_URL}/workspace`,
    ADD_MEMBER: (workspaceId: string) => `${API_BASE_URL}/workspace/${workspaceId}/members`,
    DELETE: (workspaceId: string) => `${API_BASE_URL}/workspace/${workspaceId}`,
  },
  PAYMENT: {
    CREATE_SESSION: `${API_BASE_URL}/payment/create-checkout-session`,
    CREATE_PORTAL_SESSION: `${API_BASE_URL}/payment/create-portal-session`,
  }
} as const;