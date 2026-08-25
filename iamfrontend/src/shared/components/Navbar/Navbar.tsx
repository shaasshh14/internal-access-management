import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbLabel = pathSegments.length > 0
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : "Dashboard";

  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-50 transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <h2 className="font-semibold text-lg sm:text-xl text-slate-900 capitalize tracking-tight">
          {breadcrumbLabel.replace(/-/g, " ")}
        </h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        <button
          className="p-2 rounded-lg hover:bg-slate-50 transition text-slate-600"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-slate-50 transition text-slate-600 relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition text-slate-600"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white text-xs shadow-sm ring-2 ring-white">
              PL
            </div>
            <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-20 py-1.5 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-900">Patricia Lee</p>
                  <p className="text-xs text-slate-500 mt-0.5">patricia.lee@company.com</p>
                  <p className="text-[10px] text-blue-600 font-medium mt-1">IAM Administrator</p>
                </div>
                <button
                  onClick={() => { navigate("/settings"); setShowProfileMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition font-medium"
                >
                  Account Settings
                </button>
                <div className="border-t border-slate-100 my-0.5" />
                <button
                  onClick={async () => { await logout(); navigate("/login", { replace: true }); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
