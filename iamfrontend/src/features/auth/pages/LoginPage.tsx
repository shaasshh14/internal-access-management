import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../services/authService";
import { useState } from "react";

import type { LoginRequest } from "../../../shared/types/auth";
import { loginSchema } from "../validation/loginSchema";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    });
    
    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await login(data);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-700">
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
            >
                <h1 className="mb-6 text-3xl font-bold">
                    Login
                </h1>

                <div className="mb-4">
                    <label className="mb-2 block font-medium">
                        Email
                    </label>

                    <input 
                        type="email"
                        {...register("email")}
                        className="w-full rounded-lg border p-3"
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}