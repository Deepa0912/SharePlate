import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Droplets, Leaf, ShieldCheck, Heart, Share2, Download, Trash2 } from 'lucide-react';

const ImpactCertificate = ({ donation, ngo, onClose }) => {
    if (!donation) return null;

    const eco = donation.eco_impact || { water_saved_liters: 0, co2_saved_kg: 0 };
    const missionDate = new Date(donation.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
            >
                {/* Certificate Frame Decor */}
                <div className="absolute inset-0 border-[16px] border-emerald-50/50 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

                {/* Content */}
                <div className="relative z-10 p-12 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
                                <Award className="w-12 h-12 text-white" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border-2 border-dashed border-emerald-200 rounded-full"
                            />
                        </div>
                    </div>

                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Official Sustainability Receipt</p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Certificate of Impact</h2>

                    <div className="space-y-6 mb-12">
                        <p className="text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                            This acknowledges that <span className="text-slate-900 font-bold block mt-1">{donation.food_name}</span>
                            was successfully rescued and delivered to
                            <span className="text-emerald-700 font-black block mt-1 text-xl">{ngo?.name || "Verified Local Hub"}</span>
                        </p>

                        <div className="h-px w-32 bg-slate-100 mx-auto"></div>

                        <p className="text-sm font-bold text-slate-400 italic">
                            "Turning Surplus into Strength"
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50">
                            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                                <Droplets size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Water Rescued</span>
                            </div>
                            <div className="text-3xl font-black text-emerald-700 tracking-tighter">
                                {eco.water_saved_liters} <span className="text-sm">Liters</span>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                <Leaf size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">CO2 Offset</span>
                            </div>
                            <div className="text-3xl font-black text-blue-700 tracking-tighter">
                                {eco.co2_saved_kg} <span className="text-sm">Kilograms</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Mission ID</p>
                            <p className="text-xs font-mono font-bold text-slate-500">{donation.id?.toUpperCase() || "SHP-V2-BETA"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-emerald-600/30" />
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Deployment Date</p>
                                <p className="text-xs font-bold text-slate-500">{missionDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex gap-3">
                        <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
                            <Download size={16} /> Save PDF
                        </button>
                        <button className="flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all active:scale-95">
                            <Share2 size={16} /> Share Impact
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImpactCertificate;
