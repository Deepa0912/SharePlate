// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

function Home() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: "🍱",
      title: t('how_step1_title'),
      desc: t('how_step1_desc'),
    },
    {
      icon: "🤖",
      title: t('how_step2_title'),
      desc: t('how_step2_desc'),
    },
    {
      icon: "🏠",
      title: t('how_step3_title'),
      desc: t('how_step3_desc'),
    },
  ];

  const impactPoints = [
    { icon: "👶", label: t('impact_orphanage') },
    { icon: "🌾", label: t('impact_hunger') },
    { icon: "🤝", label: t('impact_community') },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)" }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "28px" }}>🍽️</span>
          <h1 className="text-3xl font-bold" style={{ color: "#059669" }}>SharePlate</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link to="/login" className="px-5 py-2 rounded-lg font-semibold transition-all" style={{ background: "#059669", color: "white" }}>
            {t('login')}
          </Link>
          <Link to="/signup" className="px-5 py-2 border-2 rounded-lg font-semibold transition-all hover:bg-emerald-50" style={{ borderColor: "#059669", color: "#059669" }}>
            {t('signup')}
          </Link>
        </div>
      </nav>

      {/* Mission Banner */}
      <div style={{ background: "linear-gradient(135deg, #059669, #047857)" }} className="py-3 text-center text-white text-sm font-medium">
        🌍 {t('mission_banner')}
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: "#d1fae5", color: "#065f46" }}>
          <span>🤖</span> {t('ai_badge')}
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-800 max-w-4xl leading-tight mb-4">
          {t('hero_title1')}
          <span style={{ color: "#059669" }}>{t('hero_title2')}</span>
        </h2>
        <p className="text-xl text-slate-500 mt-4 max-w-3xl leading-relaxed">
          {t('hero_desc')}
        </p>

        {/* Impact tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {impactPoints.map((p, i) => (
            <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm" style={{ background: "white", color: "#374151", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
              {p.icon} {p.label}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="px-8 py-4 rounded-xl text-lg font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: "#059669", color: "white" }}>
            {t('btn_start')}
          </Link>
          <Link to="/login" className="px-8 py-4 border-2 rounded-xl text-lg font-semibold transition-all hover:bg-emerald-50" style={{ borderColor: "#059669", color: "#059669" }}>
            {t('login')}
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid md:grid-cols-3 gap-6 px-10 pb-16 max-w-5xl mx-auto">
        {[
          { val: "500+", label: t('stat_donations'), icon: "🍱" },
          { val: "120+", label: t('stat_ngos'), icon: "🏢" },
          { val: "10K+", label: t('stat_meals'), icon: "🍽️" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl text-center border-t-4 transition-shadow hover:shadow-md" style={{ borderColor: "#059669" }}>
            <div style={{ fontSize: "36px" }} className="mb-3">{s.icon}</div>
            <h3 className="text-5xl font-extrabold mb-2" style={{ color: "#059669" }}>{s.val}</h3>
            <p className="text-slate-500 font-medium text-lg">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Who We Help Section */}
      <div className="py-16 px-10" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-extrabold text-slate-800 mb-3">{t('who_title')}</h3>
          <p className="text-slate-500 mb-10 text-lg">{t('who_desc')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🏠", title: t('who_orphan_title'), desc: t('who_orphan_desc'), color: "#fef3c7", border: "#f59e0b" },
              { icon: "🧑‍🤝‍🧑", title: t('who_poor_title'), desc: t('who_poor_desc'), color: "#fee2e2", border: "#ef4444" },
              { icon: "🌟", title: t('who_community_title'), desc: t('who_community_desc'), color: "#dcfce7", border: "#22c55e" },
            ].map((w, i) => (
              <div key={i} className="p-7 rounded-2xl border-b-4 transition-all hover:shadow-md" style={{ background: w.color, borderColor: w.border }}>
                <div style={{ fontSize: "42px" }} className="mb-3">{w.icon}</div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{w.title}</h4>
                <p className="text-slate-600 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-10" style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-extrabold text-slate-800 mb-3">{t('how_title')}</h3>
          <p className="text-slate-500 mb-12 text-lg">{t('how_subtitle')}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4" style={{ borderColor: "#059669" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm mb-4" style={{ background: "#059669" }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: "36px" }} className="mb-3">{s.icon}</div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h4>
                  <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl" style={{ transform: "translateY(-50%)", color: "#059669" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-extrabold text-slate-800 mb-3 text-center">{t('feat_title')}</h3>
          <p className="text-slate-500 text-center mb-10 text-lg">{t('feat_subtitle')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: t('feat_don_title'), desc: t('feat_don_desc'), icon: "🍱" },
              { title: t('feat_ngo_title'), desc: t('feat_ngo_desc'), icon: "🏢" },
              { title: t('feat_vol_title'), desc: t('feat_vol_desc'), icon: "🚴" },
            ].map((f, i) => (
              <div key={i} className="p-7 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all" style={{ borderColor: "#059669" }}>
                <div style={{ fontSize: "36px" }} className="mb-3">{f.icon}</div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: "linear-gradient(135deg, #059669, #047857)" }} className="py-16 px-10 text-center text-white">
        <div style={{ fontSize: "48px" }} className="mb-4">🙏</div>
        <h3 className="text-4xl font-extrabold mb-4">{t('cta_title')}</h3>
        <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">{t('cta_desc')}</p>
        <Link to="/signup" className="inline-block px-10 py-4 rounded-xl text-lg font-bold transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: "white", color: "#059669" }}>
          {t('btn_start')} →
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 text-center text-slate-400 border-t border-slate-100">
        <div style={{ fontSize: "28px" }} className="mb-2">🍽️</div>
        <p className="font-semibold text-slate-500 mb-1">SharePlate</p>
        <p className="text-sm">{t('footer')}</p>
      </footer>
    </div>
  );
}

export default Home;