// src/pages/Leaderboard.jsx
// ========================
// Hall of Heroes: SharePlate Community Impact Leaderboard.
// Premium v2.5.0 design with glassmorphism and karma analytics.

import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { Trophy, Star, Award, Heart, TrendingUp, ShieldCheck, Zap, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroCard = ({ entry, isMe }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-8 rounded-[3rem] border transition-all duration-500 overflow-hidden group ${isMe
                ? "bg-slate-900 text-white border-slate-800 shadow-2xl"
                : "bg-white text-slate-800 border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100"
            }`}
    >
        {/* Rank Badge */}
        <div className={`absolute top-6 right-8 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${entry.rank === 1 ? "bg-amber-400 text-white shadow-amber-200" :
                entry.rank === 2 ? "bg-slate-300 text-white shadow-slate-200" :
                    entry.rank === 3 ? "bg-amber-600/60 text-white shadow-amber-600/20" :
                        isMe ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"
            }`}>
            #{entry.rank}
        </div>

        <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner ${isMe ? "bg-slate-800" : "bg-slate-50 group-hover:bg-emerald-50 transition-colors"
                }`}>
                {entry.rank === 1 ? "👑" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : "👤"}
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">
                    {entry.tier}
                </div>
                <h4 className="text-xl font-black tracking-tight flex items-center gap-2">
                    {entry.display_name}
                    {isMe && <span className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded-full text-white uppercase italic">YOU</span>}
                </h4>
            </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-current/5 pt-6">
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Karma Points</div>
                <div className={`text-2xl font-black ${isMe ? "text-emerald-400" : "text-emerald-600"}`}>{entry.karma}</div>
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Meals Rescued</div>
                <div className="text-2xl font-black text-slate-400 group-hover:text-amber-500 transition-colors">{entry.meals_rescued}</div>
            </div>
        </div>
    </motion.div>
);

const StatMini = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/10`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</div>
            <div className="text-xl font-black text-slate-800 leading-none">{value}</div>
        </div>
    </div>
);

function Leaderboard() {
    const { t } = useLanguage();
    const [leaders, setLeaders] = useState([]);
    const [myStats, setMyStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentUserEmail = (localStorage.getItem("token")
        ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).email
        : "");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lRes, kRes] = await Promise.all([
                    API.get("/leaderboard"),
                    API.get(`/my-karma/${currentUserEmail}`)
                ]);
                setLeaders(lRes.data);
                setMyStats(kRes.data);
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUserEmail]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="font-black text-slate-400 uppercase tracking-widest text-xs">Scaling the Wall of Heroes...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 py-16">
                <header className="mb-16 text-center space-y-6">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-emerald-100/50 shadow-sm">
                            <Trophy size={14} className="animate-bounce" /> Hall of Heroes
                        </div>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-none">
                        Humanitarian <span className="text-emerald-600">Impact</span>
                    </h2>
                    <p className="text-slate-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed uppercase tracking-tighter opacity-70">
                        Celebrating the top nutrient-savers and community guardians. Your mission is part of a global movement.
                    </p>
                </header>

                {/* My Status Banner */}
                <AnimatePresence>
                    {myStats && (
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                                <div className="md:col-span-4 flex items-center gap-8">
                                    <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-5xl shadow-xl">
                                        {myStats.tier.split(' ')[0]}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-1">Your Standing</div>
                                        <h3 className="text-3xl font-black tracking-tight">{myStats.tier}</h3>
                                        <div className="text-emerald-200 font-bold text-sm mt-1">{myStats.karma} Mission Points</div>
                                    </div>
                                </div>

                                <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatMini icon={TrendingUp} label="Rank" value={`#${leaders.find(l => l.email === currentUserEmail)?.rank || '—'}`} color="bg-white/20" />
                                    <StatMini icon={Heart} label="Meals Saved" value={myStats.meals_rescued} color="bg-white/20" />
                                    <StatMini icon={ShieldCheck} label="Tier" value={myStats.tier.split(' ')[1]} color="bg-white/20" />
                                    <StatMini icon={Zap} label="Donations" value={myStats.donations_made} color="bg-white/20" />
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between px-6">
                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">Top Contributors</h4>
                            <div className="h-1 w-24 bg-emerald-500/20 rounded-full"></div>
                        </div>

                        <div className="grid gap-6">
                            {leaders.map((entry) => (
                                <HeroCard key={entry.rank} entry={entry} isMe={entry.email === currentUserEmail} />
                            ))}
                        </div>
                    </div>

                    <aside className="space-y-8">
                        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
                            <Award className="text-amber-500 mb-6 group-hover:rotate-12 transition-transform" size={48} />
                            <h5 className="text-xl font-black text-slate-800 mb-4 tracking-tight">Karma Rewards</h5>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                Earn Karma points for every nutrient rescue. High priority foods and fast collections yield the highest rewards.
                            </p>
                            <div className="space-y-4">
                                <RewardItem label="Urgent Mission" pts="+25" color="text-rose-500" />
                                <RewardItem label="Fast Collection" pts="+20" color="text-blue-500" />
                                <RewardItem label="Cooked Food Bonus" pts="+10" color="text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <Star className="text-emerald-400 mb-6 animate-pulse" size={48} />
                            <h5 className="text-xl font-black mb-4 tracking-tight">Tier Roadmap</h5>
                            <div className="space-y-6">
                                <TierStep label="Platinum Commander" pts="1000+" icon="💎" active={myStats?.karma >= 1000} />
                                <TierStep label="Gold Guardian" pts="500+" icon="🥇" active={myStats?.karma >= 500 && myStats?.karma < 1000} />
                                <TierStep label="Silver Specialist" pts="200+" icon="🥈" active={myStats?.karma >= 200 && myStats?.karma < 500} />
                                <TierStep label="Bronze Volunteer" pts="0+" icon="🥉" active={myStats?.karma < 200} />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

const RewardItem = ({ label, pts, color }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</div>
        <div className={`font-black ${color}`}>{pts}</div>
    </div>
);

const TierStep = ({ label, pts, icon, active }) => (
    <div className={`flex items-center gap-4 transition-all duration-500 ${active ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
        <div className="text-2xl">{icon}</div>
        <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{pts} Points</div>
            <div className="text-xs font-bold">{label}</div>
        </div>
    </div>
);

export default Leaderboard;
