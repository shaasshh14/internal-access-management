import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = (variant: "neutral" | "primary" | "success" | "warning" | "danger" | "info") =>
    cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        {
            neutral: "border border-slate-200 bg-slate-50 text-slate-600",
            primary: "border border-blue-200 bg-blue-50 text-blue-600",
            success: "border border-success-200 bg-success-50 text-success-600",
            warning: "border border-warning-200 bg-warning-50 text-warning-600",
            danger: "border border-danger-200 bg-danger-50 text-danger-600",
            info: "border border-info-200 bg-info-50 text-info-600",
        }
    );

export interface BadgeProps {
    children: React.ReactNode;
    variant?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
    className?: string;
}

export default function Badge({ children, variant = "neutral", className }: BadgeProps) {
    return (
        <span className={cn(badgeVariants(variant), className)}>{children}</span>
    );
}