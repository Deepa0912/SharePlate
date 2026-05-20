// src/pages/Signup.jsx
// ====================
// Premium v2.5.0 Signup: Onboarding for Mission impact.
// Modern card-based role selection and glassmorphic UI.

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import { User, Heart, ShieldCheck, Mail, Lock, UserPlus, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const MISSION_BG = "file:///C:/Users/jagadeesh/.gemini/antigravity/brain/acd0790a-d5a0-4f13-a6fb-fa2302f21661/charity_mission_hero_1779297352151.png";

const RoleCard = ({ id, label, icon: Icon, active, onClick }) => (
  <div
    onClick={() => onClick(id)}
    className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 group ${active
        ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10 scale-105"
        : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
      }`}
  >
    {active && (
      <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
        <Check size={12} strokeWidth={4} />
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200" : "bg-slate-50 text-slate-400 group-hover:text-emerald-500"
      }`}>
      <Icon size={24} />
    </div>
    <div className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-emerald-600" : "text-slate-400"}`}>
      {label}
    </div>
  </div>
);

function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/signup", formData);
      alert(response.data.message || "Onboarding successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-x-hidden">
      {/* Visual Header (Mobile) / Sidebar (Desktop) */}
      <div className="hidden lg:block lg:w-1/3 relative bg-slate-900 overflow-hidden">
        <img
          src={MISSION_BG}
          alt="Humanitarian"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-900"></div>

        <div className="absolute top-20 left-12 right-12 space-y-12">
          <Link to="/" className="flex items-center gap-3 decoration-none group">
            <span className="text-4xl group-hover:rotate-12 transition-transform">🍽️</span>
            <h1 className="text-2xl font-black tracking-tight text-white italic">
              Share<span className="text-emerald-400">Plate</span>
            </h1>
          </Link>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-none tracking-tighter capitalize transition-all">
              Initiate your <span className="text-emerald-400">Mission</span> impact.
            </h2>
            <div className="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
            <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-tighter opacity-80">
              Join the digital loop to rescue nutrients, connect with verified NGOs, and document humanitarian success in real-time.
            </p>
          </div>

          <div className="pt-12 grid gap-6">
            <ImpactBrief icon={ShieldCheck} label="Verified Identity Management" />
            <ImpactBrief icon={Heart} label="Direct Impact Tracking" />
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 md:p-20 bg-white">
        <div className="absolute top-10 right-10 flex items-center gap-6">
          <LanguageSelector />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
              {t('signup_title')}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Become a Humanitarian Agent</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <User size={12} /> {t('ph_name')}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Agent Name"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Mail size={12} /> {t('ph_email')}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="agent@shareplate.org"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <ShieldCheck size={12} /> Strategic Role
              </label>
              <div className="grid grid-cols-3 gap-6">
                <RoleCard id="donor" label="Donor" icon={Heart} active={formData.role === "donor"} onClick={(r) => setFormData(p => ({ ...p, role: r }))} />
                <RoleCard id="ngo" label="NGO / Hub" icon={ShieldCheck} active={formData.role === "ngo"} onClick={(r) => setFormData(p => ({ ...p, role: r }))} />
                <RoleCard id="volunteer" label="Volunteer" icon={UserPlus} active={formData.role === "volunteer"} onClick={(r) => setFormData(p => ({ ...p, role: r }))} />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Lock size={12} /> Security Key
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 mt-8 ${loading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                }`}
            >
              {loading ? "Establishing Identity..." : "Finalize Enrollment"} <ArrowRight size={20} />
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-slate-400">Existing Agent?</span>
            <Link to="/login" className="text-sm font-black text-slate-800 hover:text-emerald-600 underline decoration-2 underline-offset-4">
              Execute Login
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}

const ImpactBrief = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-4 text-emerald-100/40">
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
      <Icon size={16} />
    </div>
    <div className="text-xs font-bold tracking-tight">{label}</div>
  </div>
);

export default Signup;