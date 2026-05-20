// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 brand-font">SharePlate</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link to="/login" className="px-6 py-2.5 font-bold text-white rounded-full transition-all hover:shadow-lg active:scale-95" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
            {t('login')}
          </Link>
          <Link to="/signup" className="px-6 py-2.5 font-bold border-2 rounded-full transition-all hover:bg-slate-50 active:scale-95" style={{ borderColor: "#059669", color: "#059669" }}>
            {t('signup')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold mb-8 animate-fade-in">
            <span>🇮🇳</span> {t('mission_banner')}
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            {t('hero_title1')}
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #059669, #10b981)" }}>
              {t('hero_title2')}
            </span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed mb-10 font-medium">
            {t('hero_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="px-10 py-4 text-lg font-bold text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
              {t('btn_start')} →
            </Link>
            <Link to="/login" className="px-10 py-4 text-lg font-bold border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-semibold text-slate-700">
              Explore Platform
            </Link>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl -z-10"></div>
      </div>

      {/* Impact Stats - Sticky Visual */}
      <div className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            { val: "500+", label: t('stat_donations'), sub: "Verified Recoveries" },
            { val: "120+", label: t('stat_ngos'), sub: "Partner Orphanages" },
            { val: "10K+", label: t('stat_meals'), sub: "Lives Nourished" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <h3 className="text-5xl font-black text-slate-900 mb-2">{s.val}</h3>
              <p className="text-emerald-700 font-bold mb-1">{s.label}</p>
              <p className="text-slate-400 text-sm">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What We Do - Feeding India Style */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h3 className="text-4xl font-extrabold text-slate-900 mb-4">{t('who_title')}</h3>
            <p className="text-lg text-slate-500 max-w-2xl">{t('who_desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sources.map((s, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${s.border} ${s.color} transition-all hover:scale-[1.02] hover:shadow-xl group`}>
                <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">{s.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - High Resolution Process */}
      <div className="py-24 px-6 bg-slate-900 text-white rounded-[3rem] mx-4 my-12 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold mb-4">{t('how_title')}</h3>
            <p className="text-slate-400 text-lg">{t('how_subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-emerald-500/20">
                  {s.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3">{s.title}</h4>
                <p className="text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Final CTA */}
      <div className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h3 className="text-5xl font-black text-slate-900 mb-6">{t('cta_title')}</h3>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">{t('cta_desc')}</p>
        <Link to="/signup" className="inline-block px-12 py-5 text-xl font-bold text-white rounded-full transition-all hover:scale-105 shadow-2xl active:scale-95" style={{ background: "linear-gradient(135deg, #059669, #047857)" }}>
          Join the Hunger Heroes →
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-black text-slate-900">SharePlate</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">{t('footer')}</p>
          <div className="flex gap-6 text-slate-400 text-sm font-bold">
            <a href="#" className="hover:text-emerald-600 transition-colors">Safety</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;