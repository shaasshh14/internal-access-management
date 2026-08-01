import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../services/authService";
import { loginSchema } from "../validation/loginSchema";

import type { LoginRequest } from "../types/auth";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: LoginRequest) => {
        try {
            setIsLoading(true);
            const user = await login(data);
            console.log(user);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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

                <div className="mb-6">
                    <label className="mb-2 block font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        {...register("password")}
                        className="w-full rounded-lg border p-3"
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
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