// src/pages/Settings.jsx
// =====================
// User Settings and Profile Management for SharePlate v2.5.0.
// Premium UI with smooth transitions and localized controls.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Shield,
    Bell,
    Moon,
    Globe,
    LogOut,
    ChevronRight,
    Settings as SettingsIcon,
    CheckCircle,
    AlertCircle,
    Lock,
    ShieldCheck,
    Sun,
    Save
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

const SettingsCard = ({ children, title, icon: Icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative group"
    >
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
);

const SettingItem = ({ label, value, icon: Icon, onClick, color = "text-slate-900" }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between group/item py-2 transition-all"
    >
        <div className="flex items-center gap-4">
            {Icon && <div className="text-slate-400 group-hover/item:text-emerald-500 transition-colors"><Icon size={18} /></div>}
            <div className="text-left">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</div>
                <div className={`font-bold tracking-tight ${color}`}>{value}</div>
            </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover/item:translate-x-1 group-hover/item:text-emerald-500 transition-all" />
    </button>
);

const Toggle = ({ active, onToggle }) => (
    <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${active ? "bg-emerald-500" : "bg-slate-200"}`}
    >
        <motion.div
            animate={{ x: active ? 24 : 0 }}
            className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
    </button>
);

function Settings() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(
        () => document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark"
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");
    let initialEmail = "humanitarian@shareplate.org";
    let initialName = localStorage.getItem("userName") || "Platinum Commander";

    try {
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            initialEmail = payload.email || initialEmail;
        }
    } catch (e) {
        console.error("JWT parse error:", e);
    }

    const [userName, setUserName] = useState(initialName);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const handleSave = async () => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const API = (await import("../services/api")).default;
            await API.put("/user/update", { email: initialEmail, name: userName });
            localStorage.setItem("userName", userName);
            setSuccess(t('profile_updated'));
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(t('profile_update_fail'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold shadow-sm"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold shadow-sm"
                        >
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Control Center
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
                            App <span className="text-emerald-600">Settings</span>
                        </h2>
                        <p className="text-slate-500 font-medium mt-3 text-lg">
                            Manage your humanitarian profile and platform preferences.
                        </p>
                    </motion.div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-8 py-4 rounded-[1.5rem] font-black shadow-xl scale-100 hover:scale-[1.02] active:scale-95 transition-all text-sm ${isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700"
                            }`}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-600 mx-auto mb-6 flex items-center justify-center text-5xl border-8 border-white/5 shadow-2xl">
                                    {userName.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight mb-1">{userName}</h3>
                                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Verified Commander</p>

                                <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-left">
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <Mail size={16} /> {initialEmail}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-5 rounded-[2rem] bg-rose-50 text-rose-600 font-black flex items-center justify-center gap-3 hover:bg-rose-100 transition-all border border-rose-100"
                        >
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <SettingsCard title="Profile Information" icon={User}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-800"
                                    />
                                </div>
                                <SettingItem label="Email Address" value={initialEmail} />
                            </div>
                        </SettingsCard>

                        <SettingsCard title="Security & Privacy" icon={Shield}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SettingItem label="Password" value="••••••••••••" onClick={() => navigate("/forgot-password")} />
                                <SettingItem label="Privacy Level" value="Stealth Mode" />
                            </div>
                        </SettingsCard>

                        <SettingsCard title="Preferences" icon={SettingsIcon}>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Language</div>
                                            <div className="font-bold">Localized Experience</div>
                                        </div>
                                    </div>
                                    <LanguageSelector />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Bell className="text-slate-400" size={20} />
                                            <div className="text-sm font-bold text-slate-700">Push Notifications</div>
                                        </div>
                                        <Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Moon className="text-slate-400" size={20} />
                                            <div className="text-sm font-bold text-slate-700">OLED Dark Mode</div>
                                        </div>
                                        <Toggle active={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                                    </div>
                                </div>
                            </div>
                        </SettingsCard>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showSaveAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-slate-900 text-white dark:bg-emerald-600 rounded-full font-black flex items-center gap-3 shadow-2xl border border-white/10"
                    >
                        <CheckCircle className="text-emerald-500" size={20} />
                        Preferences securely updated
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Settings;
