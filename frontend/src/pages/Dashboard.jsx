// src/pages/Dashboard.jsx
// ========================
// Main donor dashboard for SharePlate v2.5.0.
// Premium Tailwind-driven UI with AI food rescue intelligence.

import { useState, useEffect, useCallback, useMemo } from "react";
const MISSION_BG = "/assets/mission-bg.png";
import API from "../services/api";
import NGOBadge from "../components/NGOBadge";
import FoodClassifier from "../components/FoodClassifier";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import { Heart, Star, Package, MapPin, Search, Trash2, Clock, CheckCircle, ExternalLink, Calendar, Info, Trophy, Droplets, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ── Strategic Constants ──────────────────────────────────────────────────────
const AUTO_FILL_THRESHOLD = 0.6;

// ── Dashboard UI Sub-components ─────────────────────────────────────────────
const DashboardInput = ({ label, name, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
      <span className="opacity-60">{icon}</span> {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300 group-hover:border-slate-200"
    />
  </div>
);

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil(end / 30);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration * 33);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
};

const SuccessParticles = ({ active }) => (
  <AnimatePresence>
    {active && (
      <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 1.5, 0.5],
              x: (Math.random() - 0.5) * 600,
              y: (Math.random() - 0.5) * 600,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute"
          >
            {i % 3 === 0 ? "🥗" : i % 3 === 1 ? "🍎" : "✨"}
          </motion.div>
        ))}
      </div>
    )}
  </AnimatePresence>
);

const QuickImpactStat = ({ label, value, color, bg, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${bg} p-6 rounded-[2.5rem] border border-slate-100 hover:border-emerald-100 transition-all group`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${color} shadow-sm group-hover:shadow-md transition-all`}>
        <Icon size={20} />
      </div>
      <div className="h-1 w-8 bg-slate-200/50 rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</div>
    <div className={`text-2xl font-black ${color} tracking-tighter leading-none`}>
      <AnimatedCounter value={value} />
    </div>
  </motion.div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full font-black text-xs transition-all tracking-tight ${active
      ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 scale-105"
      : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
      }`}
  >
    {children}
  </button>
);

const SustainabilityAnalytics = ({ data }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Droplets className="w-6 h-6 text-emerald-500 animate-bounce" /> Eco-Impact Lens
          </h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Combined Resource Retention</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Water (L)
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> CO2 (kg)
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
              dy={12}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 900 }}
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
            />
            <Area type="monotone" dataKey="water" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorWater)" activeDot={{ r: 8, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="co2" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorCO2)" activeDot={{ r: 8, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div>
          <h4 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" /> Daily Rescues
          </h4>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Strategic Successes</p>
        </div>
      </div>

      <div className="h-[280px] w-full relative z-10 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
              dy={12}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid #1e293b', padding: '20px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#f8fafc' }}
            />
            <Bar dataKey="water" name="Rescues" fill="#10b981" radius={[12, 12, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </div>
);

// ── Logic Helpers ────────────────────────────────────────────────────────────
const getDynamicExpiry = (createdAt, expiryLabel) => {
  if (!expiryLabel) return { label: "Unknown", percentRemaining: 100, isExpired: false };

  const createdDate = new Date(createdAt);
  const now = new Date();

  // Extract number of hours from label like "4 hours"
  const hoursMatch = expiryLabel.match(/(\d+)/);
  const totalHours = hoursMatch ? parseInt(hoursMatch[0]) : 4;

  const expiryDate = new Date(createdDate.getTime() + totalHours * 60 * 60 * 1000);
  const msRemaining = expiryDate - now;
  const totalMs = totalHours * 60 * 60 * 1000;

  const percentRemaining = Math.max(0, Math.min(100, (msRemaining / totalMs) * 100));
  const isExpired = msRemaining <= 0;

  let label = isExpired ? "Expired" : `${Math.ceil(msRemaining / (1000 * 60))} min left`;
  if (!isExpired && msRemaining > 60 * 60 * 1000) {
    label = `${Math.round(msRemaining / (1000 * 60 * 60))} hours left`;
  }

  return { label, percentRemaining, isExpired };
};

function Dashboard() {
  const { t } = useLanguage();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((curr) => curr + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const token = localStorage.getItem("token");
  let currentUserEmail = "";
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserEmail = payload.email || "";
    }
  } catch (e) {
    console.error("JWT parse error:", e);
  }

  const [donations, setDonations] = useState([]);
  const [ngoMap, setNgoMap] = useState({});
  const [ngoLoading, setNgoLoading] = useState({});
  const [volunteerShifts, setVolunteerShifts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({ food_name: "", quantity: "", expiry_time: "", location: "", donor_id: currentUserEmail });
  const [image, setImage] = useState(null);
  const [postcardData, setPostcardData] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "alert", onConfirm: null, onCancel: null });

  const customAlert = (message, title = "Mission Update") => {
    return new Promise((resolve) => {
      setModalConfig({ isOpen: true, title, message, type: "alert", onConfirm: () => { setModalConfig(p => ({ ...p, isOpen: false })); resolve(true); } });
    });
  };

  const customConfirm = (message, title = "Strategic Decision") => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true, title, message, type: "confirm",
        onConfirm: () => { setModalConfig(p => ({ ...p, isOpen: false })); resolve(true); },
        onCancel: () => { setModalConfig(p => ({ ...p, isOpen: false })); resolve(false); }
      });
    });
  };

  const fetchNGORecommendations = async (list) => {
    const loadingState = {}; list.forEach(d => loadingState[d.id] = true); setNgoLoading(loadingState);
    const results = await Promise.allSettled(list.map(d => API.get(`/recommended-ngo/${d.id}`)));
    const ngoState = {};
    list.forEach((d, i) => { ngoState[d.id] = results[i].status === "fulfilled" ? results[i].value.data : null; });
    setNgoMap(ngoState); setNgoLoading({});
  };

  const fetchDonations = async () => {
    try {
      const { data } = await API.get("/donations");
      setDonations(data);
      fetchNGORecommendations(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchVolunteerShifts = async () => {
    try {
      const { data } = await API.get("/volunteer-shifts?max_results=3");
      setVolunteerShifts(data.shifts || []);
    } catch (err) { console.error(err); }
  };

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString(undefined, { weekday: 'short' }),
        dateStr: d.toISOString().split('T')[0],
        water: 1200 + (Math.random() * 800), // Base community impact
        co2: 40 + (Math.random() * 30)
      };
    });

    // Add current real data
    donations.forEach(don => {
      const date = don.created_at.split('T')[0];
      const day = last7Days.find(d => d.dateStr === date);
      if (day) {
        const qty = parseFloat(don.quantity) || 5;
        day.water += qty * 50;
        day.co2 += qty * 0.15;
      }
    });

    return last7Days;
  }, [donations]);

  useEffect(() => { fetchDonations(); fetchVolunteerShifts(); }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFoodDetected = useCallback((name, conf) => { if (conf >= AUTO_FILL_THRESHOLD) setFormData(p => ({ ...p, food_name: name })); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData(); Object.entries(formData).forEach(([k, v]) => data.append(k, v)); if (image) data.append("image", image);
    try {
      await API.post("/donate", data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await customAlert("Your mission contribution has been accepted. Connecting to NGOs...", "Mission Launched");
      setFormData({ food_name: "", quantity: "", expiry_time: "", location: "", donor_id: currentUserEmail });
      setImage(null); fetchDonations();
    } catch (err) { await customAlert("Mission failed. Please check network connectivity.", "Error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (await customConfirm("Permanently remove this food mission from the grid?", "Revoke Mission")) {
      try { await API.delete(`/donation/${id}`); fetchDonations(); } catch (err) { await customAlert("Action failed."); }
    }
  };

  const handleBook = async (id) => {
    if (await customConfirm("Do you wish to claim this food for recovery?", "Start Recovery")) {
      try { await API.post(`/donation/${id}/book`, { email: currentUserEmail }); await customAlert("Mission assigned. Travel to the location indicated.", "Success"); fetchDonations(); }
      catch (err) { await customAlert("Mission claimed by another agent.", "Conflict"); }
    }
  };

  const handleCancelBooking = async (id) => {
    if (await customConfirm("Abandon this recovery mission?", "Surrender Mission")) {
      try { await API.post(`/donation/${id}/cancel-booking`); fetchDonations(); } catch (err) { await customAlert("Fail."); }
    }
  };

  const handleCollect = async (id) => {
    if (await customConfirm("Confirm food has been recovered and secured?", "Mission Accomplished")) {
      try { await API.post(`/donation/${id}/collect`); await customAlert("Excellent work. Nutrients secured.", "Impact Recorded"); fetchDonations(); }
      catch (err) { await customAlert("Collection failed."); }
    }
  };

  const handleViewPostcard = async (id) => {
    try { const { data } = await API.get(`/donation/${id}/postcard`); setPostcardData(data); }
    catch (err) { await customAlert("Postcard generation failed."); }
  };

  const filtered = useMemo(() => {
    return donations.filter(d => {
      if (activeTab === "available" && (d.status === "Booked" || d.status === "Collected")) return false;
      if (activeTab === "bookings" && d.booked_by !== currentUserEmail) return false;
      if (activeTab === "donations" && d.donor_id !== currentUserEmail) return false;
      return (d.food_name || "").toLowerCase().includes(search.toLowerCase()) || (d.location || "").toLowerCase().includes(search.toLowerCase());
    });
  }, [donations, activeTab, search, currentUserEmail]);

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />
      <SuccessParticles active={showSuccess} />

      <main className="max-w-[1500px] mx-auto px-6 py-12 space-y-12 relative">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Impact Engine v2.5.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
              Mission <span className="text-emerald-600">Command</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-lg max-w-xl">
              Strategic oversight of zero-waste operations. Manage rescues, track nutrient loops, and scale your impact.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            <div className="bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Humanitarian Tier</div>
              <div className="text-slate-900 font-black flex items-center gap-3 text-xl">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-spin-slow" /> Platinum Commander
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Controls & Form */}
          <section className="lg:col-span-4 space-y-8 sticky top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <Heart className="w-6 h-6" />
                  </div>
                  Launch Mission
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-3xl mb-8">
                    <FoodClassifier onFoodDetected={handleFoodDetected} setImageFile={setImage} />
                  </div>

                  <div className="grid gap-5">
                    <DashboardInput label={t('field_food')} name="food_name" value={formData.food_name} onChange={handleChange} placeholder="e.g. Traditional Thali" icon="🍱" />
                    <DashboardInput label={t('field_quantity')} name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 50 Servings" icon="📊" />
                    <div className="grid grid-cols-2 gap-4">
                      <DashboardInput label="Urgency" name="expiry_time" value={formData.expiry_time} onChange={handleChange} placeholder="4 hours" icon="⏳" />
                      <DashboardInput label="Hub" name="location" value={formData.location} onChange={handleChange} placeholder="Sector 4" icon="📍" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 mt-4 ${submitting
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-emerald-600 text-white shadow-slate-200"
                      }`}
                  >
                    {submitting ? "Processing Data..." : "Execute Donation →"}
                  </button>
                </form>
              </div>
            </motion.div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
              <h4 className="text-xl font-black mb-4 flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                Strategic Insights
              </h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 opacity-80">
                Our AI Hub actively manages nutrient retention by matching pickups to the most efficient logistics routes in Sector 4.
              </p>
              <div className="space-y-4">
                <ImpactBar label="Logistics Efficiency" val={94} color="bg-emerald-500" />
                <ImpactBar label="Community Reach" val={88} color="bg-blue-500" />
              </div>
            </div>
          </section>

          {/* Feed & Stats */}
          <section className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <QuickImpactStat label="Missions" value={donations.length} color="text-emerald-600" bg="bg-emerald-50" icon={Package} />
              <QuickImpactStat label="In Transit" value={donations.filter(d => d.status === 'Booked').length} color="text-blue-600" bg="bg-blue-50" icon={Clock} />
              <QuickImpactStat label="Impact" value="4.2" color="text-amber-600" bg="bg-amber-50" icon={Star} />
              <QuickImpactStat label="Hubs" value="12" color="text-rose-600" bg="bg-rose-50" icon={MapPin} />
            </div>

            <SustainabilityAnalytics data={chartData} />

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex bg-slate-50 p-1.5 rounded-full w-full md:w-auto">
                <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>All Units</TabButton>
                <TabButton active={activeTab === "available"} onClick={() => setActiveTab("available")}>Available</TabButton>
                <TabButton active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")}>My Claims</TabButton>
                <TabButton active={activeTab === "donations"} onClick={() => setActiveTab("donations")}>My Posts</TabButton>
              </div>
              <div className="relative w-full md:w-80 group">
                <input
                  type="text"
                  placeholder="Strategic Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-sm text-slate-800"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Shift Dashboard */}
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Active Micro-Shifts</h4>
                  <div className="h-1 w-12 bg-emerald-500 mt-2 rounded-full"></div>
                </div>
              </div>

              {volunteerShifts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {volunteerShifts.map((shift) => (
                    <div key={shift.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 transition-all hover:border-emerald-200 hover:bg-emerald-50/20 group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight">{shift.food_name}</div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${shift.urgency_level === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                          {shift.urgency_level}
                        </span>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-3">
                          <Package className="w-4 h-4 opacity-40" /> {shift.quantity}
                        </div>
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-3">
                          <MapPin className="w-4 h-4 opacity-40 text-rose-400" /> {shift.location}
                        </div>
                      </div>
                      <div className="pt-6 border-t border-slate-200/50 flex flex-col gap-2">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Optimum Route Found</div>
                        <div className="text-[10px] font-bold text-slate-400">{shift.recommended_ngo?.name || "Tier 1 Hub"} • {shift.recommended_ngo?.distance_km ?? "1.4"} km</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                  <Clock className="mx-auto mb-4 opacity-20" size={48} />
                  <div className="uppercase tracking-[0.2em] text-[10px] font-black">Scanning for urgent missions...</div>
                </div>
              )}
            </div>

            {/* Donation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
              <AnimatePresence mode="popLayout">
                {filtered.map((d) => (
                  <motion.div
                    layout
                    key={d.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <DonationCard
                      donation={d}
                      t={t}
                      handleBook={handleBook}
                      handleCollect={handleCollect}
                      handleCancelBooking={handleCancelBooking}
                      handleDelete={handleDelete}
                      handleViewPostcard={handleViewPostcard}
                      currentUserEmail={currentUserEmail}
                      ngo={ngoMap[d.id]}
                      ngoLoading={!!ngoLoading[d.id]}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <Modal modalConfig={modalConfig} />
      <Postcard data={postcardData} onClose={() => setPostcardData(null)} />
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

const DonationCard = ({ donation, t, handleBook, handleCollect, handleCancelBooking, handleDelete, handleViewPostcard, currentUserEmail, ngo, ngoLoading }) => {
  const expiryInfo = getDynamicExpiry(donation.created_at, donation.expiry_time);
  const isMine = donation.donor_id === currentUserEmail;
  const isBookedByMe = donation.status === 'Booked' && donation.booked_by === currentUserEmail;

  return (
    <article className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group relative flex flex-col h-full active:scale-[0.99] cursor-default">
      <div className="relative h-60 overflow-hidden shrink-0">
        <img src={donation.image_url} alt={donation.food_name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute top-6 right-6 flex gap-2">
          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg border border-white/20 ${donation.priority === 'HIGH' ? 'bg-rose-500/80 text-white' :
            donation.priority === 'MEDIUM' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'
            }`}>
            {donation.priority || 'MEDIUM'}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-10 flex flex-col grow">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 grow group-hover:text-emerald-700 transition-colors">{donation.food_name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Calendar size={12} /> {new Date(donation.created_at).toLocaleDateString()}
            </div>
          </div>
          <span className={`shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${expiryInfo.isExpired ? 'bg-rose-50 text-rose-600 border-rose-100' :
            donation.status === 'Booked' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              donation.status === 'Collected' ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            {expiryInfo.isExpired ? '⚠️ Expired' : (donation.status || 'Available')}
          </span>
        </div>

        <div className="space-y-4 mb-8 grow">
          <CardInfo icon={<Package size={14} />} label="Payload" value={donation.quantity} />
          <CardInfo icon={<Clock size={14} />} label="Dynamic Expiry" value={expiryInfo.label} color={expiryInfo.isExpired ? "text-rose-500" : "text-emerald-600"} />
          <CardInfo icon={<MapPin size={14} />} label="Deployment" value={donation.location} />
        </div>

        <div className="h-2 w-full bg-slate-50 rounded-full mb-8 overflow-hidden shrink-0 border border-slate-100/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expiryInfo.percentRemaining}%` }}
            className={`h-full transition-all duration-1000 ${expiryInfo.percentRemaining < 30 ? 'bg-rose-500' :
              expiryInfo.percentRemaining < 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
          />
        </div>

        <NGOBadge ngo={ngo} loading={ngoLoading} />

        <div className="mt-10 pt-8 border-t border-slate-50 grid gap-3 shrink-0">
          {(donation.status === 'Pending' || donation.status === 'Available' || donation.status === 'Approved' || !donation.status) && !expiryInfo.isExpired && (
            <button
              onClick={() => handleBook(donation.id)}
              className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 group/btn"
            >
              Claim Mission <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          )}

          {isBookedByMe && (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleCollect(donation.id)} className="py-5 bg-blue-600 text-white rounded-3xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Collect
              </button>
              <button onClick={() => handleCancelBooking(donation.id)} className="py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all text-sm">Abandon</button>
            </div>
          )}

          {donation.status === 'Collected' && (
            <button onClick={() => handleViewPostcard(donation.id)} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
              <span className="text-xl">💌</span> Review Postcard
            </button>
          )}

          <button onClick={() => handleDelete(donation.id)} className="w-full py-2 text-slate-300 hover:text-rose-400 font-black text-[9px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mt-2 opacity-50 hover:opacity-100">
            <Trash2 size={12} /> Remove Mission
          </button>
        </div>
      </div>
    </article>
  );
};

const CardInfo = ({ icon, label, value, color = "text-slate-900" }) => (
  <div className="flex items-center justify-between text-xs">
    <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
        {icon}
      </div>
      {label}
    </div>
    <div className={`font-black tracking-tight ${color} text-right max-w-[150px] truncate`}>{value}</div>
  </div>
);

const ImpactBar = ({ label, val, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
      <span>{label}</span>
      <span>{val}%</span>
    </div>
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} className={`h-full ${color}`}></motion.div>
    </div>
  </div>
);

const Modal = ({ modalConfig }) => (
  <AnimatePresence>
    {modalConfig.isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-sm w-full text-center space-y-8 pointer-events-auto">
          <div className={`w-24 h-24 rounded-[2rem] mx-auto flex items-center justify-center text-4xl shadow-2xl ${modalConfig.type === 'confirm' ? 'bg-amber-100 text-amber-600 shadow-amber-200/50' : 'bg-emerald-100 text-emerald-600 shadow-emerald-200/50'}`}>
            {modalConfig.type === 'confirm' ? <Info size={40} /> : <Star size={40} />}
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{modalConfig.title}</h3>
            <p className="text-slate-500 font-medium mt-4 leading-relaxed">{modalConfig.message}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={modalConfig.onConfirm} className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black shadow-2xl transition-all active:scale-95">Proceed</button>
            {modalConfig.type === 'confirm' && (
              <button onClick={modalConfig.onCancel} className="w-full py-4 text-slate-400 font-black text-xs hover:text-slate-600 transition-all uppercase tracking-widest">Abandon Change</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Postcard = ({ data, onClose }) => (
  <AnimatePresence>
    {data && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div initial={{ scale: 0.8, rotate: -2 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, rotate: 2 }} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl max-w-xl w-full relative border-[12px] border-white active:scale-[1.01] transition-transform">
          <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all z-20 font-bold shadow-xl">✕</button>
          <div className="p-12 space-y-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="flex justify-between items-start">
              <div className="text-6xl grayscale opacity-20">🇮🇳</div>
              <div className="w-24 h-32 border-4 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 transform rotate-12">
                <div className="text-center">
                  <div className="text-3xl">🥘</div>
                  <div className="text-[8px] font-black text-slate-300 mt-2 uppercase tracking-tighter">Certified Rescue</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{data.title}</h3>
              <p className="text-2xl font-bold text-emerald-600 leading-tight">"{data.donor_message}"</p>
            </div>
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <p className="italic text-slate-600 font-medium leading-relaxed text-xl underline decoration-emerald-200 decoration-4 underline-offset-8">"{data.story}"</p>
            </div>
            <div className="flex justify-between items-end border-t-4 border-double border-slate-100 pt-8">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 space-y-1">
                <div>📅 {new Date(data.date).toLocaleDateString()}</div>
                <div>📍 {data.location}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Impact Record #FI-2024</div>
                <div className="text-slate-800 font-black">SharePlate India</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Dashboard;