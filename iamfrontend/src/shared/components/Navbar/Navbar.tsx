import {Bell, Search, CircleUserRound} from "lucide-react";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Navbar () {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", {replace: true});
    };

    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">

            <h2 className="font-semibold text-xl">
                Internal Access Management
            </h2>

            <div className="flex items-center gap-5">

                <Search className="cursor-pointer" />

                <Bell className="cursor-pointer" />

                <div className="flex items-center gap-3">
                    <CircleUserRound size={32} />

                    <button
                        onClick={handleLogout}
                        className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
                
            </div>

        </header>
    );
}