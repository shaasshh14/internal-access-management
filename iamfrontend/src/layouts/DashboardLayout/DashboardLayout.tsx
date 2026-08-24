import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Navbar from "../../shared/components/Navbar/Navbar";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Right Side */}
            <div className="flex flex-1 flex-col min-w-0">

                {/* Navbar */}
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 bg-slate-100">

                    {/* Container */}
                    <Outlet />

                </main>
            </div>
        </div>
    );
}