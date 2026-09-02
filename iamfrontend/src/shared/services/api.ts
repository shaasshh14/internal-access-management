import axios from "axios";
import { refreshAccessToken } from "../../features/auth/services/refreshService";

const api = axios.create ({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
    timeout: 10000,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("iam_access_token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

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
        const hasAccessToken = Boolean(
            localStorage.getItem("iam_access_token")
        );
        const isAuthRequest = originalRequest?.url?.startsWith("/auth/");
        
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            hasAccessToken &&
            !isAuthRequest
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
