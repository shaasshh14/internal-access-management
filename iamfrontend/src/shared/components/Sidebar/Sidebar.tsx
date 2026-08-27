import {
  Home,
  Shield,
  Users,
  ClipboardList,
  FileText,
  Settings,
  AppWindow,
  ShieldCheck,
  X,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from "../Logo/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuGroups = [
  {
    title: "OVERVIEW",
    items: [
      { title: "Dashboard", icon: Home, path: "/dashboard" },
      { title: "My Access", icon: Shield, path: "/access" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { title: "Users", icon: Users, path: "/users" },
      { title: "Applications", icon: AppWindow, path: "/applications" },
      { title: "Requests", icon: ClipboardList, path: "/requests" },
      { title: "Roles", icon: ShieldCheck, path: "/roles" },
    ],
  },
  {
    title: "SECURITY",
    items: [
      { title: "Audit Logs", icon: FileText, path: "/audit" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const content = (
    <>
      <div className="h-16 px-4 flex items-center border-b border-slate-800/60">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={group.title} className={idx > 0 ? "mt-6" : ""}>
            <h3 className="px-3 mb-2 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                        isActive
                          ? "bg-blue-600/10 text-white font-medium"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-blue-500 rounded-r" />
                        )}
                        <Icon size={18} className={cn("shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                        <span className="truncate">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="p-3 border-t border-slate-800/60">
        <div className="rounded-lg p-2.5 hover:bg-slate-800/40 transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white text-xs ring-2 ring-slate-800">
              PL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">Patricia Lee</p>
              <p className="text-[11px] text-slate-500 truncate">IAM Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800/60 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
        <div className="mt-2 px-1 flex items-center gap-1.5 text-[10px] text-slate-600">
          <HelpCircle size={10} />
          <span>v2.4.1 · Encore IAM</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800/80">
        {content}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-slate-900 text-white flex flex-col border-r border-slate-800">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
