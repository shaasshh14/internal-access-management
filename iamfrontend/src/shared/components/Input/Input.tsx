import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes <HTMLInputElement> {
    label: string;
    registration? : UseFormRegisterReturn;
    error? : string;
}

export default function Input ({
    label,
    registration,
    error,
    className = "",
    ...props
}: InputProps) {
    return (
        <div className="mb-4">
            <label className="mb-2 block font-medium">
                {label}
            </label>

            <input 
                {...registration}
                {...props}
                className= {`w-full rounded-lg border p-3 ${className}`}
                />

                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
        </div>
    );
}