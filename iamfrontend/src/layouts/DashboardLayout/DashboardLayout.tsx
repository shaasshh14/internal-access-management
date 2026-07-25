import { Outlet } from "react-router-dom";

import Sidebar from "../../shared/components/Sidebar/Sidebar";
import Navbar from "../../shared/components/Navbar/Navbar";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div className="flex flex-1 flex-col">

                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 p-6 bg-slate-100">

                    {/* Container */}
                    <Outlet />

                </main>
            </div>
        </div>
    );
}