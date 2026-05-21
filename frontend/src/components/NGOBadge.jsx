// src/components/NGOBadge.jsx
// ----------------------------
// Premium Tailwind-based NGO recommendation card for donation entries.

import { MapPin, Phone, Heart } from "lucide-react";

function NGOBadge({ ngo, loading }) {

  // ── Loading shimmer ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/60 animate-pulse space-y-2">
        <div className="h-3 w-1/2 bg-emerald-200/60 rounded-full" />
        <div className="h-4 w-3/4 bg-emerald-200/40 rounded-full" />
        <div className="h-3 w-2/5 bg-emerald-200/30 rounded-full" />
      </div>
    );
  }

  // ── No NGO found ─────────────────────────────────────────────────────────
  if (!ngo) {
    return (
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2 opacity-50">
        <span className="text-lg">🏢</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No partner NGO available</span>
      </div>
    );
  }

  // ── Badge colour by match % ───────────────────────────────────────────────
  const pct = ngo.match_percentage ?? 0;
  const badgeClass =
    pct >= 80 ? "bg-emerald-500" :
      pct >= 60 ? "bg-amber-500" :
        "bg-rose-500";

  const distanceLabel = ngo.distance_km != null
    ? `${ngo.distance_km} km away`
    : ngo.city || "Distance unavailable";

  const specialities = Array.isArray(ngo.speciality)
    ? ngo.speciality.join(", ")
    : ngo.speciality;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-100/80 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
            AI Partner Match
          </span>
        </div>
        <span className={`${badgeClass} text-white text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide`}>
          {pct}% match
        </span>
      </div>

      {/* NGO Name */}
      <p className="text-sm font-black text-slate-800 leading-tight mb-3">{ngo.name}</p>

      {/* Info chips */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100/60 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200/40">
          <MapPin className="w-3 h-3" /> {distanceLabel}
        </span>
        {specialities && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100/60 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200/40 capitalize">
            🍽️ {specialities}
          </span>
        )}
      </div>

      {/* Contact */}
      {ngo.contact && (
        <a
          href={`tel:${ngo.contact}`}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors mt-1"
        >
          <Phone className="w-3 h-3" /> {ngo.contact}
        </a>
      )}
    </div>
  );
}

export default NGOBadge;
