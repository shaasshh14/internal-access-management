import api from "../../../shared/services/api";

import type {
    LoginRequest,
    LoginResponse,
} from "../../../shared/types/auth";

export async function login (
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse> (
        "/auth/login",
        data
    );

    return response.data;
}