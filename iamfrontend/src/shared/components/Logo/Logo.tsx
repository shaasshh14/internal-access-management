interface LogoProps {
    size?: "sm" | "md" | "lg";
    withWordmark?: boolean;
    className?: string;
}

export default function Logo({ size = "md", withWordmark = true, className = "" }: LogoProps) {
    const sizeMap = {
        sm: { mark: "h-7 w-7", text: "text-base", gap: "gap-2" },
        md: { mark: "h-8 w-8", text: "text-lg", gap: "gap-2.5" },
        lg: { mark: "h-10 w-10", text: "text-xl", gap: "gap-3" },
    };
    const s = sizeMap[size];

    return (
        <div className={`flex items-center ${s.gap} ${className}`}>
            <div className={`${s.mark} relative flex items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold shadow-sm`}>
                <span className={`${s.text} leading-none tracking-tight`}>S</span>
                <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            {withWordmark && (
                <div className="flex flex-col leading-none">
                    <span className={`${s.text} font-semibold tracking-tight`}>Sentinel</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">Identity Platform</span>
                </div>
            )}
        </div>
    );
}
