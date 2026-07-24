import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h1 className="text-xl font-bold">IAM Portal</h1>
                <nav className="mt-8 space-y-3">
                    <div>Dashboard</div>
                    <div>My Access</div>
                    <div>Requests</div>
                    <div>Users</div>
                    <div>Roles</div>
                    <div>Audit Logs</div>
                    <div>Reports</div>
                    <div>Settings</div>
                </nav>
            </aside>

            {/* Right Side */}
            <div className="flex flex-1 flex-col">
                
                {/* Navbar */}
                <header className="h-16 border-b flex items-center justify-between px-6">

                    <h2 className="font-semibold text-lg">
                        Internal Access Management
                    </h2>

                    <div>
                        Welcome, Shashank!
                    </div>

                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 bg-slate-100">
                    {/*  */}
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}