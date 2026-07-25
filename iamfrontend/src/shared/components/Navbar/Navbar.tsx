import {Bell, Search, CircleUserRound} from "lucide-react";

export default function Navbar () {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">

            <h2 className="font-semibold text-xl">
                Internal Access Management
            </h2>

            <div className="flex items-center gap-5">

                <Search className="cursor-pointer" />

                <Bell className="cursor-pointer" />

                <CircleUserRound size={32} />
                
            </div>

        </header>
    );
}