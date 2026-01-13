/* FRONTEND ROUTES */

export const ROUTES = {
  AUTH: {
    SIGN_IN: "/auth/signin",
    SIGN_UP: "/auth/signup",
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
  },
  WORKSPACE: {
    base: `${API_BASE_URL}/workspace`,
    GET_ALL: `${API_BASE_URL}/workspace`,
    CREATE: `${API_BASE_URL}/workspace`,
  }
} as const;