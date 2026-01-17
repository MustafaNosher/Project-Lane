
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create();

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A response interceptor to show toast messages globally for non-get requests
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.method !== 'get' && response.data && response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
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

    toast.error(message);
    
    //Explicitly return the error to be handled by the caller
    return Promise.reject(error);
  }
);
export default apiClient;
