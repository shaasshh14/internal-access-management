import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Generate breadcrumb from current path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbLabel =
    pathSegments.length > 0
      ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
      : "Dashboard";

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <h2 className="font-semibold text-lg sm:text-xl text-slate-900 capitalize">
          {breadcrumbLabel.replace(/-/g, " ")}
        </h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {/* Search */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
          <Search size={20} className="text-slate-600" />
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-sm text-white">
              PL
            </div>
            <ChevronDown size={16} className="text-slate-600 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20 py-1">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-slate-900">Patricia Lee</p>
                  <p className="text-xs text-slate-500">patricia.lee@company.com</p>
                </div>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}