import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "hi", name: "हिंदी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
  ];

  return (
    <div className="relative group/lang flex items-center gap-2.5 px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-100 rounded-full shadow-sm hover:border-emerald-200 transition-all">
      <Globe className="w-4 h-4 text-emerald-600 animate-pulse-slow" />
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-[10px] font-black text-slate-700 uppercase tracking-widest focus:outline-none cursor-pointer appearance-none pr-1"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="text-slate-900 bg-white font-sans normal-case tracking-normal">
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
