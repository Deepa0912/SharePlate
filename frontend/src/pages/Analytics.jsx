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
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-white/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Mission Impact
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                  Eradicating Hunger, <br /><span className="text-emerald-200">One Plate at a Time.</span>
                </h1>
                <p className="text-emerald-50/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                  Through the generosity of our donors and the speed of our AI, we turn surplus from weddings and hotels into hope for thousands across India.
                </p>
              </div>
              <div className="w-full md:w-auto grid grid-cols-2 gap-4">
                <ImpactQuickStat icon={<Heart className="text-rose-400" />} value={summary?.meals_saved || 0} label="Meals Provided" />
                <ImpactQuickStat icon={<Droplets className="text-blue-400" />} value={summary?.total_water_saved_liters || 0} label="Liters Saved" />
                <ImpactQuickStat icon={<Leaf className="text-emerald-400" />} value={summary?.total_co2_saved_kg || 0} label="CO2 Offset" />
                <ImpactQuickStat icon={<Package className="text-amber-400" />} value={summary?.total_donations || 0} label="Donations" />
              </div>
            </div>
          </div>
        </section>

        {/* Global Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                  Mission Momentum
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Donation volume and recovery trends over time.</p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly View
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "none", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "12px 20px" }}
                    itemStyle={{ fontWeight: 800, fontSize: "14px", color: "#065f46" }}
                    labelStyle={{ fontWeight: 600, color: "#64748b", marginBottom: "4px" }}
                  />
                  <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={5} fill="url(#impactGradient)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Resource Rescue</h3>
            <p className="text-slate-500 font-medium text-sm mb-10">Top recovered food categories across our network.</p>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={top_foods} innerRadius={80} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                      {top_foods?.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', shadow: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-4 py-8">
                {top_foods?.map((food, i) => (
                  <div key={i} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                      <span className="text-sm font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors uppercase tracking-tight">{food.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{food.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reach Section */}
        <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 blur-[120px]"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Our Geographic Footprint</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                We are actively expanding across major Indian hubs to ensure no kitchen surplus goes to waste. Our AI identifies the nearest verified partner for rapid pickup.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {top_locations?.slice(0, 4).map((loc, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <MapPin className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{loc.donations} Missions</div>
                      <div className="text-sm font-bold truncate max-w-[120px]">{loc.location.split(',')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top_locations} layout="vertical" margin={{ left: 50, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="location" type="category" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 700 }} width={80} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(',')[0]} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="donations" fill="#10b981" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>

      {/* Footer-like CTA */}
      <footer className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Help us expand this chart.</h3>
        <button className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-200 hover:shadow-2xl active:scale-95 text-lg">
          Donate Surplus Today
        </button>
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
