import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Star } from "lucide-react";

const MISSION_STORIES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
        title: "The Grand Wedding Rescue",
        location: "Bangalore, KA",
        impact: "450 Meals shared",
        date: "May 15, 2026",
        quote: "Turning our celebration surplus into someone else's joy was the highlight of our wedding! ❤️",
        author: "Aditi & Rahul",
        category: "Wedding"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
        title: "Hotel Surplus to Hope",
        location: "Mumbai, MH",
        impact: "120 Meals recovered",
        date: "May 18, 2026",
        quote: "SharePlate's AI made the pickup so fast that the food reached the orphanage in record time. 🙏",
        author: "Chef Vikram, Taj Heritage",
        category: "Hotel"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?q=80&w=800&auto=format&fit=crop",
        title: "Sunday Feast Giveaway",
        location: "Chennai, TN",
        impact: "200 People nourished",
        date: "May 12, 2026",
        quote: "Seeing the smiles on the children's faces at the Little Hearts Orphanage was priceless. ✨",
        author: "Volunteer Kavitha",
        category: "Community"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop",
        title: "Restaurant Daily Rescue",
        location: "Delhi, NCR",
        impact: "85 Plates saved",
        date: "May 19, 2026",
        quote: "We now have zero food waste at our restaurant thanks to this mission. It's a game changer.",
        author: "Spice Garden Restaurant",
        category: "Restaurant"
    }
];

export default function MissionGallery() {
    return (
        <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MISSION_STORIES.map((story, i) => (
                    <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
                    >
                        {/* Image Wrap */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
                                    {story.category}
                                </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-white text-xs font-bold leading-relaxed italic">
                                    "{story.quote}"
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{story.impact}</span>
                            </div>

                            <h4 className="text-lg font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors">
                                {story.title}
                            </h4>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <MapPin className="w-3 h-3" />
                                    {story.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                    <Calendar className="w-3 h-3" />
                                    {story.date}
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
