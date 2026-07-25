import {
    Home,
    Shield,
    Users,
    ClipboardList,
    FileText,
    Settings,
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
        title: "Requests",
        icon: ClipboardList,
        path: "/requests",
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

export default function Sidebar() {
    return (
        <aside className='w-64 bg-slate-900 text-white flex flex-col'>
            <div className="p-4 border-b border-l-stone-700">
                <Logo/>
            </div>

            <nav className='flex-1 px-3 py-4'>
                {
                    menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink 
                                key={item.title}
                                to={item.path}
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
        </aside>
    );
}