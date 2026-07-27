import clsx from 'clsx';

interface ButtonProps {
    children: React.ReactNode;

    onClick?: () => void;

    variant?: "primary" | "secondary" | "danger";

    className?: string;
}

export default function Button({
    children,
    onClick,
    variant = "primary",
    className,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "px-4 py-2 rounded-lg transition font-medium",

                {
                    "bg-blue-600 text-white hover:bg-blue-700":
                        variant === "primary",

                    "bg-blue-200 hover:bg-slate-300":
                        variant === "secondary",

                    "bg-red-600 text-white hover:bg-red-700":
                        variant === "danger",
                },

                className
            )}
        >
            {children}
        </button>
    );
}