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
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import Logo from "../Logo/Logo";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "My Access",
    icon: Shield,
    path: "/access",
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
  },
  {
    title: "Applications",
    icon: AppWindow,
    path: "/applications",
  },
  {
    title: "Requests",
    icon: ClipboardList,
    path: "/requests",
  },
  {
    title: "Roles",
    icon: ShieldCheck,
    path: "/roles",
  },
  {
    title: "Audit Logs",
    icon: FileText,
    path: "/audit",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const content = (
    <>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className='flex-1 px-3 py-4 overflow-y-auto'>
        {
          menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 mb-2 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })
        }
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-sm">
            PL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Patricia Lee</p>
            <p className="text-xs text-slate-400 truncate">IAM Administrator</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col shrink-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}