import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export default function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-slate-200",
        {
          "rounded-md": variant === "rectangular",
          "rounded-full": variant === "circular",
          "rounded h-4": variant === "text",
        },
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <Skeleton className="h-5 w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
