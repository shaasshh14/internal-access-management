import { SelectHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  registration?: UseFormRegisterReturn;
  error?: string;
}

export default function Select({ label, options, registration, error, className = "", ...props }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="mb-2 block font-medium text-slate-700">
        {label}
      </label>
      <select
        {...registration}
        {...props}
        className={`w-full rounded-lg border border-slate-300 p-3 bg-white text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
