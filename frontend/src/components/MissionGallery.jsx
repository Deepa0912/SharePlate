import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Star, Loader2 } from "lucide-react";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function MissionGallery() {
    const { t } = useLanguage();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const { data } = await API.get("/donations");
                // Only take the top 4 most recent/high priority ones for the landing page
                setDonations(data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch missions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing with the Grid...</p>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-slate-400 font-medium">No active missions found on the grid yet.</p>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {donations.map((donation, i) => (
                    <motion.div
                        key={donation.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
                    >
                        {/* Image Wrap */}
                        <div className="relative h-64 overflow-hidden bg-slate-100">
                            {donation.image_url ? (
                                <img
                                    src={donation.image_url}
                                    alt={donation.food_name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">🍽️</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${donation.priority === "HIGH" ? "bg-rose-500 text-white" : "bg-white/90 backdrop-blur-md text-emerald-700"
                                    }`}>
                                    {donation.priority} {t('priority')}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-white text-xs font-bold leading-relaxed italic">
                                    {donation.spoilage?.spoilage_label || t('mission_in_progress')}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {donation.meals_saved || 0} {t('meals_rescued')}
                                </span>
                            </div>

                            <h4 className="text-lg font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-1">
                                {donation.food_name}
                            </h4>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <MapPin className="w-3 h-3" />
                                    {donation.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(donation.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {/* AI badge */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
