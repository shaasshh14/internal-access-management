import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    registration?: UseFormRegisterReturn;
    error?: string;
}

export default function PasswordInput ({
    label,
    registration,
    error,
    className = "",
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="mb-4">
            <label className="mb-2 block font-medium">
                {label}
            </label>

            <div className="relative">
                <input 
                    type={showPassword? "text" : "password"}
                    {...registration}
                    {...props}
                    className= {`w-full rounded-lg border p-3 pr-12 ${className}`}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}