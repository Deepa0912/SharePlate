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
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 shadow-sm hover:border-green-500 transition-colors">
      <Globe className="w-4 h-4 text-green-600" />
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-1"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="text-gray-900 bg-white">
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
