import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../services/authService";
import { loginSchema } from "../validation/loginSchema";

import type { LoginRequest } from "../types/auth";
import Input from "../../../shared/components/Input/Input";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput";

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

                <Input 
                    label="Email"
                    type="Email"
                    placeholder="Enter your Email"
                    registration={register("email")}
                    error={errors.email?.message}
                />

                <PasswordInput 
                    label="Password"
                    placeholder="Enter your password"
                    registration={register("password")}
                    error={errors.password?.message}
                />

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