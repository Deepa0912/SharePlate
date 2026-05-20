// src/pages/ForgotPassword.jsx
// ==========================
// Premium v2.5.0 Password Recovery: Mission-Critical Security.
// Modern glassmorphic recovery flow with strategic synergy.

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import { ShieldAlert, Mail, Lock, Key, Settings, ArrowLeft, ArrowRight, CheckCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MISSION_BG = "file:///C:/Users/jagadeesh/.gemini/antigravity/brain/acd0790a-d5a0-4f13-a6fb-fa2302f21661/charity_mission_hero_1779297352151.png";

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [devCode, setDevCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [smtpUser, setSmtpUser] = useState(localStorage.getItem("shareplate_smtp_user") || "");
  const [smtpPassword, setSmtpPassword] = useState(localStorage.getItem("shareplate_smtp_password") || "");
  const [showSmtpSettings, setShowSmtpSettings] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (smtpUser) localStorage.setItem("shareplate_smtp_user", smtpUser);
      if (smtpPassword) localStorage.setItem("shareplate_smtp_password", smtpPassword);

      const response = await API.post("/forgot-password", {
        email,
        smtp_user: smtpUser || null,
        smtp_password: smtpPassword || null,
      });
      if (response.data.email_sent) {
        setEmailSent(true);
        setSuccess(`Code dispatched to ${email}`);
      } else {
        setEmailSent(false);
        setSuccess("Strategic code generated.");
        if (response.data.reset_code) setDevCode(response.data.reset_code);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Displacement failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/reset-password", {
        email,
        reset_code: resetCode,
        new_password: newPassword
      });
      setSuccess("Access restored. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Restoration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Narrative Blend */}
      <img src={MISSION_BG} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-110" alt="bg" />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

      <div className="absolute top-10 right-10">
        <LanguageSelector />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[4rem] p-12 md:p-16 shadow-2xl w-full max-w-xl relative z-10"
      >
        <div className="space-y-4 mb-12 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-xl shadow-emerald-500/5">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none"> Restoring Access </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em]">Strategic Identity Recovery</p>
            <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black p-4 rounded-2xl mb-8 flex items-center gap-3">
              <ShieldAlert size={16} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black p-4 rounded-2xl mb-8 flex items-center gap-3">
              <CheckCircle size={16} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Mail size={12} /> {t('ph_email')}
              </label>
              <input
                type="email"
                placeholder="agent@shareplate.org"
                value={email}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
              <button
                type="button"
                onClick={() => setShowSmtpSettings(!showSmtpSettings)}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <span className="flex items-center gap-2"><Settings size={14} /> Mission SMTP Gateway</span>
                <span>{showSmtpSettings ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {showSmtpSettings && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Gmail Identity</label>
                        <input type="email" placeholder="sender@gmail.com" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="w-full p-3 text-xs bg-white border border-slate-100 rounded-xl" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">App Passcode</label>
                        <input type="password" placeholder="16-letter secure key" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} className="w-full p-3 text-xs bg-white border border-slate-100 rounded-xl font-mono" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
              {loading ? "Dispatching..." : "Send Restoration Code"} <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Key size={12} /> Strategic Code
              </label>
              <input
                type="text"
                placeholder="000 000"
                value={resetCode}
                className="w-full px-6 py-5 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-black text-2xl text-center tracking-[0.5em] text-emerald-700"
                onChange={(e) => setResetCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Lock size={12} /> New Mission Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all font-bold text-slate-800"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {devCode && (
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                <Info className="text-amber-500 shrink-0" size={18} />
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Sandbox Debug Key</div>
                  <div className="text-sm font-black text-slate-800 font-mono tracking-widest">{devCode}</div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
              {loading ? "Restoring..." : "Execute Restoration"} <ArrowRight size={20} />
            </button>
          </form>
        )}

        <footer className="text-center pt-12">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-emerald-600 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('back_to_login') || "Return to Mission Control"}
          </Link>
        </footer>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
