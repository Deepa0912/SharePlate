// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import MissionGallery from "../components/MissionGallery";
import { ArrowRight, Star, Heart, TrendingUp, Users, Package } from "lucide-react";

function Home() {
  const { t } = useLanguage();

  const sources = [
    { icon: "💍", title: t('who_orphan_title'), desc: t('who_orphan_desc'), color: "bg-amber-50", border: "border-amber-200" },
    { icon: "🏨", title: t('who_poor_title'), desc: t('who_poor_desc'), color: "bg-emerald-50", border: "border-emerald-200" },
    { icon: "🤖", title: t('who_community_title'), desc: t('who_community_desc'), color: "bg-blue-50", border: "border-blue-200" },
  ];

  const steps = [
    { icon: "📸", title: t('how_step1_title'), desc: t('how_step1_desc') },
    { icon: "🧬", title: t('how_step2_title'), desc: t('how_step2_desc') },
    { icon: "🚚", title: t('how_step3_title'), desc: t('how_step3_desc') },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <span className="text-2xl font-black tracking-tight text-slate-900">SharePlate</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link to="/login" className="px-6 py-2.5 font-bold text-white rounded-[1.25rem] transition-all hover:shadow-xl hover:shadow-emerald-200 active:scale-95 text-sm" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
            {t('login')}
          </Link>
          <Link to="/signup" className="px-6 py-2.5 font-bold border-2 rounded-[1.25rem] transition-all hover:bg-slate-50 active:scale-95 text-sm" style={{ borderColor: "#059669", color: "#059669" }}>
            {t('signup')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black tracking-widest uppercase mb-10 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" /> {t('mission_banner')}
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">
            {t('hero_title1')}
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #059669, #10b981)" }}>
              {t('hero_title2')}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed mb-12 font-medium">
            {t('hero_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup" className="group px-12 py-5 text-lg font-black text-white rounded-2xl shadow-2xl shadow-emerald-200 hover:shadow-emerald-300 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
              {t('btn_start')} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link to="/analytics" className="px-12 py-5 text-lg font-black border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-700 flex items-center gap-3">
              <TrendingUp className="w-5 h-5" /> View Impact
            </Link>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[120px] -z-10"></div>
      </div>

      {/* Impact Stats - Sticky Visual */}
      <div className="bg-slate-900 py-20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px]"></div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-16 relative z-10">
          {[
            { val: "500+", label: t('stat_donations'), sub: "Verified Recoveries", icon: <Package className="w-5 h-5 text-emerald-400" /> },
            { val: "120+", label: t('stat_ngos'), sub: "Partner Orphanages", icon: <Users className="w-5 h-5 text-amber-400" /> },
            { val: "10K+", label: t('stat_meals'), sub: "Lives Nourished", icon: <Heart className="w-5 h-5 text-rose-400" /> },
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-6xl font-black text-white mb-2 tracking-tighter">{s.val}</h3>
              <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-2">{s.label}</p>
              <p className="text-slate-500 text-sm font-medium">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Gallery Section */}
      <div className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
              ✨ Success Stories
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">AI Mission Gallery</h3>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Real stories of hope and recovery. Our AI tracks every mission from surplus capture to successful delivery.
            </p>
          </div>
          <MissionGallery />
        </div>
      </div>

      {/* What We Do - Feeding India Style */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{t('who_title')}</h3>
            <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">{t('who_desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sources.map((s, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border ${s.border} ${s.color} transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-slate-200/50 group cursor-default`}>
                <div className="text-6xl mb-8 transform transition-transform group-hover:scale-110 duration-500 drop-shadow-sm">{s.icon}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{s.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - High Resolution Process */}
      <div className="py-32 px-6 bg-emerald-600 text-white rounded-[4rem] mx-4 my-16 overflow-hidden relative shadow-2xl shadow-emerald-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-[120px]"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('how_title')}</h3>
            <p className="text-emerald-50 text-lg md:text-xl font-medium opacity-90">{t('how_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-20">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold mb-8 shadow-xl shadow-black/5 group-hover:scale-110 transition-all duration-500 border border-white/20">
                  {s.icon}
                </div>
                <h4 className="text-2xl font-black mb-4 tracking-tight">{s.title}</h4>
                <p className="text-emerald-50 leading-relaxed font-medium opacity-80">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision 2030 Roadmap Section */}
      <div className="py-24 px-6 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
              🚀 Mission Roadmap
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Vision 2030: Zero Hunger</h3>
            <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
              Our strategic plan to eliminate food waste and ensure food security for every citizen across the subcontinent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-emerald-100 -translate-y-1/2 -z-10"></div>
            {[
              { year: "2024", title: "AI Deployment", desc: "Scaling surplus detection across 50+ tier-1 cities." },
              { year: "2026", title: "Hyper-Local Hubs", desc: "Building 500+ decentralized recovery centers." },
              { year: "2028", title: "Institutional Shift", desc: "National policy integration for zero-waste hospitality." },
              { year: "2030", title: "Zero Hunger", desc: "Total elimination of preventable food waste in transit." }
            ].map((node, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="text-3xl font-black text-emerald-600 mb-4 group-hover:scale-110 transition-transform origin-left">{node.year}</div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{node.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-32 px-6 text-center max-w-4xl mx-auto">
        <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">{t('cta_title')}</h3>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">{t('cta_desc')}</p>
        <Link to="/signup" className="group inline-flex items-center gap-3 px-14 py-6 text-xl font-black text-white rounded-[2rem] transition-all hover:scale-105 shadow-[0_20px_50px_rgba(5,150,105,0.3)] active:scale-95" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
          Join the Hunger Heroes <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🍽️</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">SharePlate</span>
            </div>
            <div className="flex gap-10 text-slate-500 text-sm font-black uppercase tracking-widest">
              <a href="#" className="hover:text-emerald-600 transition-colors">Safety</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            </div>
          </div>
          <div className="text-center md:text-left text-slate-400 text-xs font-bold leading-relaxed max-w-md">
            {t('footer')}
            <p className="mt-2">© 2026 SharePlate Collective. Powered by AI for Social Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;