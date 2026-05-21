import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Droplets, Leaf, Package, MapPin, TrendingUp, Info } from "lucide-react";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function Analytics() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/analytics");
      setData(data);
      setError(null);
    } catch (err) {
      console.error("[Impact Center] fetch error:", err);
      setError("Unable to sync impact data. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl">🌱</span>
        </div>
        <p className="mt-6 text-emerald-800 font-bold tracking-widest animate-pulse uppercase text-xs">
          Computing Collective Impact...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Sync Delayed</h2>
          <p className="text-slate-600 mb-8 leading-relaxed font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { summary, monthly_trends, top_foods, top_locations } = data;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans selection:bg-emerald-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Impact Hero */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-[100px]"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-white/20 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
                  {t('analytics_hero_title').split(',')[0]}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">
                  {t('analytics_hero_title').split(',')[0]} <br /><span className="text-emerald-300">{t('analytics_hero_title').split(',')[1]}</span>
                </h1>
                <p className="text-emerald-50/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {t('analytics_hero_subtitle')}
                </p>
              </div>
              <div className="w-full lg:w-auto grid grid-cols-2 gap-6">
                <ImpactQuickStat icon={<Heart className="text-rose-400" />} value={summary?.meals_saved || 0} label={t('stat_meals')} />
                <ImpactQuickStat icon={<Droplets className="text-blue-400" />} value={summary?.total_water_saved_liters || 0} label={t('stat_water')} />
                <ImpactQuickStat icon={<Leaf className="text-emerald-400" />} value={summary?.total_co2_saved_kg || 0} label={t('stat_co2')} />
                <ImpactQuickStat icon={<Package className="text-amber-400" />} value={summary?.total_donations || 0} label={t('stat_donations')} />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Global Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-10 md:p-12 shadow-sm hover:shadow-2xl transition-all duration-700 group"
          >
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  Mission Momentum
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-3">Collective impact trajectory scaling for 2030.</p>
              </div>
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Live Feed Sync
              </div>
            </div>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#cbd5e1" tick={{ fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} dy={15} />
                  <YAxis stroke="#cbd5e1" tick={{ fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", padding: "16px 24px" }}
                    itemStyle={{ fontWeight: 900, fontSize: "16px", color: "#065f46" }}
                    labelStyle={{ fontWeight: 700, color: "#94a3b8", marginBottom: "6px", textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={6} fill="url(#impactGradient)" animationDuration={3000} strokeLinecap="round" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-12 shadow-2xl flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Rescue Mix</h3>
            <p className="text-slate-500 font-medium text-sm mb-12">Diversity of nutrients recovered across sectors.</p>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={top_foods} innerRadius={90} outerRadius={115} paddingAngle={10} dataKey="value" stroke="none">
                      {top_foods?.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-5 py-10">
                {top_foods?.map((food, i) => (
                  <div key={i} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                      <span className="text-xs font-black text-slate-400 group-hover/item:text-white transition-colors uppercase tracking-widest">{food.name}</span>
                    </div>
                    <span className="text-sm font-black text-white">{food.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Geographic Hubs */}
        <section className="bg-white border border-slate-100 rounded-[4rem] p-12 md:p-20 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-[100px]"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest mb-8">
                <MapPin className="w-4 h-4" /> Global Hub Network
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 leading-none">
                Our Geographic <br /><span className="text-emerald-600">Command.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
                We are actively expanding across major Indian hubs to ensure no kitchen surplus goes to waste. Our AI identifies the nearest verified partner for rapid pickup.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {top_locations?.slice(0, 4).map((loc, i) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={i}
                    className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 flex items-center gap-5 transition-all hover:bg-white hover:shadow-xl group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{loc.donations} Units</div>
                      <div className="text-sm font-black text-slate-800 truncate max-w-[120px]">{loc.location.split(',')[0]}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[3rem] p-12 h-[500px] shadow-2xl relative">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.03]"></div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top_locations} layout="vertical" margin={{ left: 60, right: 30, top: 20, bottom: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="location" type="category" stroke="#475569" tick={{ fontSize: 10, fontWeight: 900 }} width={80} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(',')[0].toUpperCase()} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#ffffff' }}
                    itemStyle={{ fontWeight: 900, fontSize: '14px', color: '#10b981' }}
                  />
                  <Bar dataKey="donations" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24} animationDuration={2000}>
                    {top_locations?.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? '#10b981' : '#334155'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-slate-50 border border-slate-100 rounded-[4rem] p-16 md:p-24 shadow-sm"
        >
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Ready to scale the mission?</h3>
          <p className="text-slate-500 font-medium text-lg mb-12 max-w-xl mx-auto">Your donation today fuels the trajectory of tomorrow's hunger-free India.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-14 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black transition-all shadow-2xl shadow-emerald-500/20 text-xl"
          >
            Launch Survival Mission
          </motion.button>
        </motion.div>
      </footer>
    </div>
  );
}

function ImpactQuickStat({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 flex flex-col justify-center min-w-[140px] shadow-lg">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 text-xl">
        {icon}
      </div>
      <div className="text-3xl font-black tracking-tight mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200/70">{label}</div>
    </div>
  );
}

export default Analytics;
