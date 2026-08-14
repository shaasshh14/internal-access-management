import api from "../../../shared/services/api";

export async function getCurrentUser() {
    const response = await api.get("/auth/me");

    return response.data;
}