import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const getBgColor = (n: string) => {
    const colors = [
      "bg-blue-600 text-white",
      "bg-emerald-600 text-white",
      "bg-indigo-600 text-white",
      "bg-purple-600 text-white",
      "bg-teal-600 text-white",
      "bg-cyan-600 text-white",
      "bg-sky-600 text-white",
      "bg-rose-600 text-white",
      "bg-amber-600 text-white",
    ];
    let sum = 0;
    for (let i = 0; i < n.length; i++) {
      sum += n.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center font-semibold rounded-full shrink-0 select-none",
        getBgColor(name),
        {
          "h-5 w-5 text-[10px]": size === "xs",
          "h-8 w-8 text-xs": size === "sm",
          "h-10 w-10 text-sm": size === "md",
          "h-12 w-12 text-base": size === "lg",
          "h-16 w-16 text-lg": size === "xl",
        },
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}