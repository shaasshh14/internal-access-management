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
    return response.data;
}

export async function logout() {
    await api.post("/auth/logout");
}
