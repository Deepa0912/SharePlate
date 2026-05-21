// src/pages/Dashboard.jsx
// ========================
// Main donor dashboard for SharePlate v2.5.0.
// Premium Tailwind-driven UI with AI food rescue intelligence.

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
const MISSION_BG = "/assets/mission-bg.png";
import API from "../services/api";
import NGOBadge from "../components/NGOBadge";
import FoodClassifier from "../components/FoodClassifier";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import ImpactCertificate from "../components/ImpactCertificate";
import { Heart, Star, Package, MapPin, Search, Trash2, Clock, CheckCircle, ExternalLink, Calendar, Info, Trophy, Droplets, Leaf, TrendingUp, Users, ArrowRight, Table, Award } from "lucide-react";
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
  if (!expiryLabel || !createdAt) return { label: "Unknown", percentRemaining: 100, isExpired: false };

  // Ensure timezone suffix for consistent UTC parsing
  const dateStr = (createdAt?.endsWith('Z') || createdAt?.includes('+')) ? createdAt : `${createdAt}Z`;
  const createdDate = new Date(dateStr);
  if (isNaN(createdDate.getTime())) return { label: "Unknown", percentRemaining: 100, isExpired: false };

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

  const [currentUserName, setCurrentUserName] = useState(localStorage.getItem("userName") || "Platinum Commander");

  const [donations, setDonations] = useState([]);
  const [ngoMap, setNgoMap] = useState({});
  const [ngoLoading, setNgoLoading] = useState({});
  const [volunteerShifts, setVolunteerShifts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({ food_name: "", quantity: "", expiry_time: "", location: "", donor_id: currentUserEmail });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [postcardData, setPostcardData] = useState(null);
  const [certData, setCertData] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "alert", onConfirm: null, onCancel: null });

  const myDonations = useMemo(() => donations.filter(d => d.donor_id === currentUserEmail), [donations, currentUserEmail]);
  const dailyTarget = 25; // kg
  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return myDonations
      .filter(d => d.created_at.startsWith(today))
      .reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 5), 0);
  }, [myDonations]);
  const goalProgress = Math.min((todayTotal / dailyTarget) * 100, 100);

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

  const handleViewCertificate = (don) => {
    setCertData({ donation: don, ngo: ngoMap[don.id] });
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
              Mission Control Engine v2.5.0
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
              Operational <span className="text-emerald-600">Command</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-lg max-w-xl">
              Strategic oversight of zero-waste operations. Manage rescues and scale your impact.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            <div className="bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Humanitarian Tier</div>
              <div className="text-slate-900 font-black flex items-center gap-3 text-xl">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-spin-slow" /> {currentUserName}
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Action Hub */}
          <section className="lg:col-span-8 space-y-12">

            {/* Daily Mission Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 border border-emerald-100 shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">Daily Mission Goal</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Rescuing Fresh Surplus Today</p>
                    </div>
                  </div>
                  <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {goalProgress >= 100 ? "🌟 Mission accomplished! You've successfully secured the grid for today." : `Launch ${Math.max(0, dailyTarget - todayTotal)} kg more to hit the humanitarian target.`}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-center min-w-[140px]">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{todayTotal}</div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{goalProgress.toFixed(0)}% Complete</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <QuickImpactStat label="Nutrients Saved" value={`${donations.reduce((acc, d) => acc + (parseFloat(d.quantity) || 5), 0)} kg`} color="text-emerald-700" bg="bg-emerald-50" icon={Package} />
              <QuickImpactStat label="Lives Touched" value={donations.length * 45} color="text-blue-700" bg="bg-blue-50" icon={Users} />
              <QuickImpactStat label="Collective Karma" value={donations.length * 100} color="text-amber-700" bg="bg-amber-50" icon={Star} />
            </div>

            {/* Inventory Hub */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-[1.8rem] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                  <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>All Units</TabButton>
                  <TabButton active={activeTab === "available"} onClick={() => setActiveTab("available")}>Available</TabButton>
                  <TabButton active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")}>My Claims</TabButton>
                  <TabButton active={activeTab === "donations"} onClick={() => setActiveTab("donations")}>My Posts</TabButton>
                </div>
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search the grid..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-64 pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white rounded-[3rem] border border-slate-100 animate-pulse">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Syncing with Peer Hubs...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filtered.map(don => (
                      <motion.div
                        layout
                        key={don.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <DonationCard
                          donation={don}
                          t={t}
                          handleBook={handleBook}
                          handleCollect={handleCollect}
                          handleCancelBooking={handleCancelBooking}
                          handleDelete={handleDelete}
                          handleViewPostcard={handleViewPostcard}
                          handleViewCertificate={handleViewCertificate}
                          currentUserEmail={currentUserEmail}
                          ngo={ngoMap[don.id]}
                          ngoLoading={ngoLoading[don.id]}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Visual Analytics - Moved from sidebar for better visibility */}
            <SustainabilityAnalytics data={chartData} />
          </section>

          {/* Sidebar Portal */}
          <aside className="lg:col-span-4 space-y-10 sticky top-24">
            {/* Deploy New Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-white/5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  New Mission
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-1 bg-white/5 border border-white/10 rounded-2xl mb-6 overflow-hidden">
                    <FoodClassifier onFoodDetected={handleFoodDetected} setImageFile={setImage} />
                  </div>

                  <div className="grid gap-5">
                    <DashboardInput label="Mission Name" name="food_name" value={formData.food_name} onChange={handleChange} placeholder="Traditional Thali" />
                    <DashboardInput label="Servings" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="50 Plates" />
                    <div className="grid grid-cols-2 gap-4">
                      <DashboardInput label="Urgency" name="expiry_time" value={formData.expiry_time} onChange={handleChange} placeholder="4h" />
                      <DashboardInput label="Sector" name="location" value={formData.location} onChange={handleChange} placeholder="Hub A" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 mt-4 ${submitting
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20"
                      }`}
                  >
                    {submitting ? "Deploying..." : "Launch Mission"}
                    {!submitting && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </motion.div>


            {/* Strategic Access Points */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/leaderboard" className="bg-white border border-slate-100 rounded-3xl p-6 text-center hover:border-emerald-200 transition-all group shadow-sm">
                <Users className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 mx-auto mb-3 transition-colors" />
                <div className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Hall of Heroes</div>
              </Link>
              <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center hover:border-blue-200 transition-all group shadow-sm">
                <Package className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mx-auto mb-3 transition-colors" />
                <div className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Global Ops</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {postcardData && <Postcard data={postcardData} onClose={() => setPostcardData(null)} />}
        {certData && <ImpactCertificate donation={certData.donation} ngo={certData.ngo} onClose={() => setCertData(null)} />}
      </AnimatePresence>
      <Modal modalConfig={modalConfig} />
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

const DonationCard = ({ donation, t, handleBook, handleCollect, handleCancelBooking, handleDelete, handleViewPostcard, handleViewCertificate, currentUserEmail, ngo, ngoLoading }) => {
  const expiryInfo = getDynamicExpiry(donation.created_at, donation.expiry_time);
  const isMine = donation.donor_id === currentUserEmail;
  const isBookedByMe = donation.status === 'Booked' && donation.booked_by === currentUserEmail;

  return (
    <article className="bg-white border border-slate-100 rounded-[1.25rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 group relative flex flex-col h-full active:scale-[0.99] cursor-default text-xs">
      <div className="relative h-32 overflow-hidden shrink-0">
        <img src={donation.image_url} alt={donation.food_name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg border border-white/20 ${donation.priority === 'HIGH' ? 'bg-rose-500/80 text-white' :
            donation.priority === 'MEDIUM' ? 'bg-amber-500/80 text-white' : 'bg-emerald-500/80 text-white'
            }`}>
            {donation.priority || 'MEDIUM'}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-1 grow group-hover:text-emerald-700 transition-colors">{donation.food_name}</h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <Calendar size={12} /> {new Date(donation.created_at).toLocaleDateString()}
            </div>
          </div>
          <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${expiryInfo.isExpired ? 'bg-rose-50 text-rose-600 border-rose-100' :
            donation.status === 'Booked' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              donation.status === 'Collected' ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            {expiryInfo.isExpired ? '⚠️ Expired' : (donation.status || 'Available')}
          </span>
        </div>

        <div className="space-y-1.5 mb-3 grow">
          <CardInfo icon={<Package size={14} />} label="Payload" value={donation.quantity} />
          <CardInfo icon={<Clock size={14} />} label="Dynamic Expiry" value={expiryInfo.label} color={expiryInfo.isExpired ? "text-rose-500" : "text-emerald-600"} />
          <CardInfo icon={<MapPin size={14} />} label="Deployment" value={donation.location} />
        </div>

        <div className="h-1.5 w-full bg-slate-50 rounded-full mb-3 overflow-hidden shrink-0 border border-slate-100/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expiryInfo.percentRemaining}%` }}
            className={`h-full transition-all duration-1000 ${expiryInfo.percentRemaining < 30 ? 'bg-rose-500' :
              expiryInfo.percentRemaining < 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
          />
        </div>

        <NGOBadge ngo={ngo} loading={ngoLoading} />

        <div className="mt-4 pt-4 border-t border-slate-50 grid gap-2 shrink-0">
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
            <div className="grid gap-2">
              <button
                onClick={() => handleViewCertificate(donation)}
                className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10 active:scale-95 transition-all"
              >
                <Award size={14} /> View Impact Certificate
              </button>
              <button onClick={() => handleViewPostcard(donation.id)} className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3">
                <span className="text-xl">💌</span> Review Postcard
              </button>
            </div>
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
    <div className="text-slate-400 font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
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
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] p-10 shadow-2xl max-w-sm w-full text-center space-y-8 pointer-events-auto">
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
        <motion.div initial={{ scale: 0.8, rotate: -2 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, rotate: 2 }} className="bg-white rounded-[2rem] overflow-hidden shadow-2xl max-w-xl w-full relative border-[12px] border-white active:scale-[1.01] transition-transform">
          <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-500 hover:text-white transition-all z-20 font-bold shadow-xl">✕</button>
          <div className="p-10 space-y-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
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
            <div className="bg-slate-50 rounded-[1.5rem] p-6 border border-slate-100">
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