import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "../services/authService";
import { loginSchema } from "../validation/loginSchema";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import type { LoginRequest } from "../types/auth";
import Input from "../../../shared/components/Input/Input";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput";
import Checkbox from "../../../shared/components/Checkbox/Checkbox";

import Logo from "../../../shared/components/Logo/Logo";

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { login: setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginRequest) => {
        setErrorMessage("");
        try {
            setIsLoading(true);
            const user = await login(data);
            console.log(user);

            setIsAuthenticated();
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage("Invalid email or password.");
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
                <div className="mb-5 flex justify-center">
                    <Logo/>
                </div>
                <h1 className="text-center text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-6 text-center text-slate-500">
                    Sign in to Internal Access Management Portal
                </p>

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

                <div className="mb-6 flex items-center justify-between">
                    <Checkbox
                        label="Remember Me"
                    />

                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                {errorMessage && (
                    <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

            </form>
        </div>
    );
}