import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

const PIE_COLORS = ["#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#6366f1"];

function Analytics() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/analytics");
      setData(data);
      setError(null);
    } catch (err) {
      console.error("[Analytics] fetch error:", err);
      setError("Failed to load analytics data. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          <span className="absolute text-2xl">🍽️</span>
        </div>
        <p className="mt-4 text-emerald-600 font-semibold tracking-wider animate-pulse">
          Analyzing Donation Records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <span className="text-5xl block mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { summary, monthly_trends, top_foods, top_locations } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/30 font-sans pb-16 text-slate-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍽️</span>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {t('brand')}
          </h1>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold border border-emerald-200 uppercase tracking-widest hidden sm:inline-block">
            {t('analytics')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm font-semibold transition-all transform hover:scale-[1.02] text-slate-700"
          >
            📋 {t('dashboard')}
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-sm font-bold shadow-md transition-all transform hover:scale-[1.02] text-white"
          >
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Hero Header */}
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 mb-2">
            📊 {t('analytics_title')}
          </h2>
          <p className="text-slate-600 font-medium">
            Real-time donation analytics, food recovery statistics, and trends.
          </p>
        </header>

        {/* Stats Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: t('card_total'),
              value: summary?.total_donations || 0,
              icon: "📦",
              color: "from-emerald-50 to-teal-50",
              border: "border-emerald-200",
              titleColor: "text-emerald-800",
              valueColor: "text-emerald-900",
              subtitle: "All-time food items donated"
            },
            {
              title: t('card_meals'),
              value: summary?.meals_saved || 0,
              icon: "🥗",
              color: "from-amber-50 to-orange-50",
              border: "border-amber-200",
              titleColor: "text-amber-800",
              valueColor: "text-amber-900",
              subtitle: "Estimated servings redirected"
            },
            {
              title: t('card_locations'),
              value: summary?.active_locations || 0,
              icon: "📍",
              color: "from-blue-50 to-indigo-50",
              border: "border-blue-200",
              titleColor: "text-blue-800",
              valueColor: "text-blue-900",
              subtitle: "Unique distribution locations"
            }
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-3xl p-6 flex items-center justify-between shadow-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-md`}
            >
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${stat.titleColor}`}>
                  {stat.title}
                </h3>
                <p className={`text-4xl font-black tracking-tight mb-1 ${stat.valueColor}`}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                  {stat.subtitle}
                </p>
              </div>
              <span className="text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
                {stat.icon}
              </span>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trend Chart (Line / Area) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              📈 {t('chart_monthly')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Monthly donation trends showing incoming donation frequency.
            </p>
            <div className="h-80 w-full flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthly_trends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    dataKey="month"
                    stroke="#475569"
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "16px",
                      color: "#1e293b",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDonations)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Foods Chart (Pie) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              🍰 {t('chart_top_foods')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Distribution of the most frequently donated items.
            </p>
            <div className="h-80 w-full flex-grow flex flex-col sm:flex-row items-center justify-center">
              {top_foods && top_foods.length > 0 ? (
                <>
                  <div className="h-full w-full sm:w-2/3">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={top_foods}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {top_foods.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            borderRadius: "16px",
                            color: "#1e293b",
                            fontSize: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-col gap-2 mt-4 sm:mt-0 sm:w-1/3 text-left w-full px-4">
                    {top_foods.map((food, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="font-semibold text-slate-700 truncate max-w-[120px]">
                          {food.name}
                        </span>
                        <span className="text-slate-900 font-bold ml-auto">
                          {food.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-slate-400 text-sm">No food data available yet</div>
              )}
            </div>
          </div>

          {/* Busiest Locations (Bar) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-all duration-300 lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              📍 {t('chart_top_locations')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Total volume of donation requests processed by geographic hub.
            </p>
            <div className="h-80 w-full flex-grow">
              {top_locations && top_locations.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={top_locations}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                      dataKey="location"
                      stroke="#475569"
                      tick={{ fill: "#475569", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => {
                        return val.split(",")[0];
                      }}
                    />
                    <YAxis
                      stroke="#475569"
                      tick={{ fill: "#475569", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "16px",
                        color: "#1e293b",
                        fontSize: "12px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                      }}
                    />
                    <Bar dataKey="donations" radius={[8, 8, 0, 0]}>
                      {top_locations.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="url(#colorBarGradient)"
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400 text-sm flex items-center justify-center h-full">
                  No location data available yet
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analytics;
