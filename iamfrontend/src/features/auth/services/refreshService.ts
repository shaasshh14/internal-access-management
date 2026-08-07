import api from "../../../shared/services/api";

export async function refreshAccessToken() {
    const response = await api.post("/auth/refresh");
    return response.data;
}