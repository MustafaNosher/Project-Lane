import apiClient from "./apiClient";
import { toast } from "sonner";
import axios from "axios";
import { logoutUser, tokenRefreshed } from "./slices/authSlice";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAxios = (store: any) => {
  apiClient.interceptors.response.use(
    (response) => {
      if (response.config.method !== 'get' && response.data && response.data.message) {
        toast.success(response.data.message);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post('/api/auth/refresh-token', {}, {
                withCredentials: true
            }); 
            
            const newToken = data.data.token;
            
            store.dispatch(tokenRefreshed(newToken));
            
            processQueue(null, newToken);
            isRefreshing = false;

            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return apiClient(originalRequest);
            
        } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            store.dispatch(logoutUser());
            // Optionally redirect to login or show session expired toast
            return Promise.reject(err);
        }
      }

      // Default error handling (toast)
      let message = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
          if (error.response && error.response.data && error.response.data.message) {
               message = error.response.data.message;
          } else if (error.message) {
              message = error.message;
          }
      } else if (error instanceof Error) {
          message = error.message;
      }
      
       if (error.response?.status !== 401 || originalRequest._retry) {
            toast.error(message);
       }

      return Promise.reject(error);
    }
  );
};
