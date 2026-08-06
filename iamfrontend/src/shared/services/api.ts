import axios from "axios";
import { config } from "zod";

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

api.interceptors.response.use (
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        return Promise.reject(error);
    }
);

export default api;