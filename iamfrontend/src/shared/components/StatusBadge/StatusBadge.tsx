import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = (variant: "neutral" | "success" | "warning" | "danger") =>
    cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
            neutral: "text-slate-500 bg-slate-100",
            success: "text-success-800 bg-success-50 border border-success-100",
            warning: "text-warning-800 bg-warning-50 border border-warning-100",
            danger: "text-danger-800 bg-danger-50 border border-danger-100",
        }
    );

export interface StatusBadgeProps {
    status: string;
    variant?: "neutral" | "success" | "warning" | "danger";
    className?: string;
}

export function StatusBadge({ status, variant = "neutral", className }: StatusBadgeProps) {
    return (
        <span className={cn(badgeVariants(variant), className)}>{status}</span>
    );
}

export default StatusBadge;