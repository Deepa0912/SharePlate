// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen theme-bg-light-gradient">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm border-b border-gray-100">
        <h1 className="text-4xl font-bold theme-text-primary">
          {t('brand')}
        </h1>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            to="/login"
            className="px-5 py-2 theme-btn-primary rounded-lg shadow-sm"
          >
            {t('login')}
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all font-semibold"
          >
            {t('signup')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-6xl font-extrabold text-slate-800 max-w-4xl leading-tight">
          {t('hero_title1')}
          <span className="theme-text-primary">{t('hero_title2')}</span>
        </h2>

        <p className="text-xl text-slate-600 mt-8 max-w-3xl">
          {t('hero_desc')}
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            to="/signup"
            className="px-8 py-4 theme-btn-primary rounded-xl text-lg shadow-md hover:shadow-lg"
          >
            {t('btn_start')}
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border border-emerald-600 text-emerald-600 rounded-xl text-lg hover:bg-emerald-50 transition-all font-semibold"
          >
            {t('login')}
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid md:grid-cols-3 gap-8 px-10 pb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border-t-4 theme-border-primary">
          <h3 className="text-5xl font-extrabold theme-text-primary mb-4">
            500+
          </h3>
          <p className="text-xl text-slate-600 font-medium">
            {t('stat_donations')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border-t-4 theme-border-primary">
          <h3 className="text-5xl font-extrabold theme-text-primary mb-4">
            120+
          </h3>
          <p className="text-xl text-slate-600 font-medium">
            {t('stat_ngos')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border-t-4 theme-border-primary">
          <h3 className="text-5xl font-extrabold theme-text-primary mb-4">
            10K+
          </h3>
          <p className="text-xl text-slate-600 font-medium">
            {t('stat_meals')}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 px-10 pb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 theme-border-primary">
          <h3 className="text-2xl font-bold theme-text-primary mb-4">
            {t('feat_don_title')}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {t('feat_don_desc')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 theme-border-primary">
          <h3 className="text-2xl font-bold theme-text-primary mb-4">
            {t('feat_ngo_title')}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {t('feat_ngo_desc')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 theme-border-primary">
          <h3 className="text-2xl font-bold theme-text-primary mb-4">
            {t('feat_vol_title')}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {t('feat_vol_desc')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 text-center text-slate-400 border-t border-slate-100">
        {t('footer')}
      </footer>
    </div>
  );
}

export default Home;