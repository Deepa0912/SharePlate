import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { LogOut, LayoutDashboard, BarChart3, Home as HomeIcon, Trophy } from "lucide-react";

export default function Navbar() {
    const { t } = useLanguage();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="flex justify-between items-center px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 group decoration-none">
                    <span className="text-3xl transition-transform group-hover:scale-110 duration-300">🍽️</span>
                    <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {t('brand')}
                    </h1>
                </Link>
                <div className="hidden md:flex items-center gap-1 ml-6 border-l border-slate-200 pl-6">
                    <NavLink to="/" active={isActive("/")} icon={<HomeIcon className="w-4 h-4" />}>
                        {t('home')}
                    </NavLink>
                    <NavLink to="/dashboard" active={isActive("/dashboard")} icon={<LayoutDashboard className="w-4 h-4" />}>
                        {t('dashboard')}
                    </NavLink>
                    <NavLink to="/analytics" active={isActive("/analytics")} icon={<BarChart3 className="w-4 h-4" />}>
                        {t('analytics')}
                    </NavLink>
                    <NavLink to="/leaderboard" active={isActive("/leaderboard")} icon={<Trophy className="w-4 h-4" />}>
                        Hall of Heroes
                    </NavLink>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <LanguageSelector />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-sm font-bold transition-all duration-300 group"
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <span className="hidden sm:inline">{t('logout')}</span>
                </button>
            </div>
        </nav>
    );
}

function NavLink({ to, children, active, icon }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${active
                ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                }`}
        >
            {icon}
            {children}
        </Link>
    );
}
