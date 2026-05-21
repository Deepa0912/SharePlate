// src/pages/NotFound.jsx
// =======================
// Premium 404 page for SharePlate — mission-themed empty state.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans flex flex-col items-center justify-center px-6 text-center selection:bg-emerald-100">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative z-10 max-w-lg"
            >
                {/* Icon */}
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-100/50"
                >
                    <MapPin className="w-12 h-12 text-emerald-500" />
                </motion.div>

                {/* 404 */}
                <div className="text-9xl font-black text-slate-100 leading-none tracking-tighter select-none mb-4">
                    404
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
                    {t('not_found_title')}
                </h1>
                <p className="text-slate-400 font-medium text-lg leading-relaxed mb-12 max-w-md mx-auto">
                    {t('not_found_desc')}
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('btn_return_base')}
                    </Link>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-700 rounded-[1.5rem] font-black hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm active:scale-95"
                    >
                        {t('btn_open_dash')}
                    </Link>
                </div>
            </motion.div>

            {/* Footer hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]"
            >
                SharePlate · Humanitarian Grid · 2026
            </motion.p>
        </div>
    );
}
