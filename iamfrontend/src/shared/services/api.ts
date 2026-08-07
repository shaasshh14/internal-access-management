import axios from "axios";
import { config } from "zod";
import { refreshAccessToken } from "../../features/auth/services/refreshService";

const api = axios.create ({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
api.interceptors.response.use (
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    await refreshAccessToken();

                    isRefreshing = false;
                }

                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;