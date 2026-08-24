import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "primary" | "success" | "warning" | "error" | "info";
  className?: string;
}

export default function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        {
          "bg-slate-50 text-slate-600 ring-slate-500/10": variant === "neutral",
          "bg-blue-50 text-blue-700 ring-blue-700/10": variant === "primary",
          "bg-green-50 text-green-700 ring-green-600/20": variant === "success",
          "bg-amber-50 text-amber-800 ring-amber-600/20": variant === "warning",
          "bg-red-50 text-red-700 ring-red-600/10": variant === "error",
          "bg-sky-50 text-sky-700 ring-sky-700/10": variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
