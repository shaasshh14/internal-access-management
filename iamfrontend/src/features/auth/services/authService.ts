import api from "../../../shared/services/api";

import type {
    LoginRequest,
    LoginResponse,
} from "../types/auth";

export async function login (
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse> (
        "/auth/login",
        data
    );
    localStorage.setItem(
        "iam_access_token",
        response.data.accessToken
    );
    return response.data;
}

export async function logout() {
    try {
        await api.post("/auth/logout");
    } finally {
        localStorage.removeItem("iam_access_token");
    }
}
