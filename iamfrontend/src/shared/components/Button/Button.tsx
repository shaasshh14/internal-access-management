import { cn } from "@/lib/utils";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "success" | "danger" | "ghost" | "text";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
}

export default function Button({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    className,
}: ButtonProps) {
    const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 focus:ring-blue-500",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400",
        success: "bg-green-600 text-white hover:bg-green-700 border border-green-700 focus:ring-green-500",
        danger: "bg-red-600 text-white hover:bg-red-700 border border-red-700 focus:ring-red-500",
        ghost: "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
        text: "text-blue-600 border border-transparent hover:bg-blue-50 focus:ring-blue-500 font-normal",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(base, variants[variant], sizes[size], className)}
        >
            {children}
        </button>
    );
}
