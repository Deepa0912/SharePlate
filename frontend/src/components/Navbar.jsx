import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { LogOut, LayoutDashboard, BarChart3, Home as HomeIcon, Trophy, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-3 decoration-none group">
                        <span className="text-3xl transition-transform group-hover:rotate-12 duration-300">🍽️</span>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800">
                            Share<span className="text-emerald-600">Plate</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        <NavLink to="/" active={isActive("/")} icon={<HomeIcon size={16} />}>{t('home')}</NavLink>
                        {token && (
                            <>
                                <NavLink to="/dashboard" active={isActive("/dashboard")} icon={<LayoutDashboard size={16} />}>{t('dashboard')}</NavLink>
                                <NavLink to="/leaderboard" active={isActive("/leaderboard")} icon={<Trophy size={16} />}>Hall of Heroes</NavLink>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <LanguageSelector />
                    </div>

                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-black transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                        >
                            <LogOut size={14} /> {t('logout')}
                        </button>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="px-6 py-2.5 text-xs font-black text-slate-600 hover:text-emerald-600 transition-all uppercase tracking-widest">{t('login')}</Link>
                            <Link to="/signup" className="px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-black transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 active:scale-95 shadow-sm uppercase tracking-widest">{t('signup')}</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 space-y-4">
                            <MobileNavLink to="/" onClick={() => setIsOpen(false)} icon={<HomeIcon size={18} />}>{t('home')}</MobileNavLink>
                            {token ? (
                                <>
                                    <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)} icon={<LayoutDashboard size={18} />}>{t('dashboard')}</MobileNavLink>
                                    <MobileNavLink to="/leaderboard" onClick={() => setIsOpen(false)} icon={<Trophy size={18} />}>Hall of Heroes</MobileNavLink>
                                    <hr className="border-slate-50" />
                                    <div className="flex items-center justify-between p-4">
                                        <LanguageSelector />
                                        <button onClick={handleLogout} className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest">
                                            <LogOut size={14} /> {t('logout')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <MobileNavLink to="/login" onClick={() => setIsOpen(false)} icon={<LogOut size={18} />}>{t('login')}</MobileNavLink>
                                    <MobileNavLink to="/signup" onClick={() => setIsOpen(false)} icon={<Trophy size={18} />}>{t('signup')}</MobileNavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ to, children, active, icon }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all ${active
                ? "bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50"
                : "text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                }`}
        >
            {icon} {children}
        </Link>
    );
}

function MobileNavLink({ to, children, icon, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 text-slate-800 font-black text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-all"
        >
            <span className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">{icon}</span>
            {children}
        </Link>
    );
}
