// src/pages/Login.jsx
// ===================
// Premium v2.5.0 Login: Mission-Driven Authentication.
// High-impact visual storytelling with glassmorphism.

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import { LogIn, Mail, Lock, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MISSION_BG = "file:///C:/Users/jagadeesh/.gemini/antigravity/brain/acd0790a-d5a0-4f13-a6fb-fa2302f21661/charity_mission_hero_1779297352151.png";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans overflow-hidden">
      {/* Visual Narrative Side */}
      <div className="hidden lg:block lg:w-1/2 relative bg-emerald-950 overflow-hidden">
        <img
          src={MISSION_BG}
          alt="Mission Hub"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/90 via-emerald-900/40 to-transparent"></div>

        <div className="absolute bottom-20 left-20 right-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-full text-emerald-400 text-xs font-black uppercase tracking-[0.3em]"
          >
            <ShieldCheck size={16} /> Certified Mission Hub
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black text-white leading-none tracking-tighter"
          >
            Join the <span className="text-emerald-400 font-normal italic">loop.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-100/60 text-xl font-medium max-w-lg leading-relaxed"
          >
            Every login is a commitment. Access your dashboard to manage food rescues, scale impact, and drive zero-hunger solutions globally.
          </motion.p>
        </div>
      </div>

      {/* Auth Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute top-10 right-10 flex items-center gap-6">
          <LanguageSelector />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 decoration-none mb-10 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🍽️</span>
              <h1 className="text-3xl font-black tracking-tight text-slate-800">
                Share<span className="text-emerald-600">Plate</span>
              </h1>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {t('login_title')}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em]">Strategic Access Gateway</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Mail size={12} /> {t('ph_email')}
              </label>
              <input
                type="email"
                name="email"
                placeholder="mission-agent@shareplate.org"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> {t('ph_password')}
                </label>
                <Link to="/forgot-password" size={10} className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 tracking-widest">
                  Recovery?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 mt-10 ${loading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-emerald-600 text-white shadow-slate-200"
                }`}
            >
              {loading ? "Verifying..." : "Enter Mission Control"} <ArrowRight size={20} />
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-slate-400">Neutral Agent?</span>
            <Link to="/signup" className="text-sm font-black text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-4">
              {t('signup')}
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;