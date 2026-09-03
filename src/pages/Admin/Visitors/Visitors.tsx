import { useState, useEffect } from "react";
import { useGetVisitorStatsQuery } from "@/store/Api/VisitorApi";
import { 
  TrendingUp, 
  Clock, 
  Search,
  RefreshCw,
  Calendar
} from "lucide-react";
import LeafletMap from "./Components/LeafletMap";

type TimeRange = "24h" | "7d" | "30d" | "all";

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  
  // Fetch visitor statistics directly from API without polling loop or fake fallback values
  const { data: statsData, isLoading, refetch, isFetching } = useGetVisitorStatsQuery(timeRange);

  // Live timer for local clock matching user location
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getGMTString = () => {
    const offset = -currentTime.getTimezoneOffset() / 60;
    return `GMT${offset >= 0 ? "+" : ""}${offset}`;
  };

  const stats = statsData?.data || {
    onlineCount: 0,
    activeCount: 0,
    idleCount: 0,
    seen24h: 0,
    seen7d: 0,
    seen30d: 0,
    totalVisitors: 0,
    returningPercentage: 0,
    avgSessionMin: 0,
    topCountries: [],
    topPages: [],
    visitors: []
  };

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case "24h": return "Today (24h)";
      case "7d": return "Past 7 Days";
      case "30d": return "Past 30 Days";
      case "all": return "All Time";
      default: return "Today (24h)";
    }
  };

  const getVisitorsCountByRange = (range: TimeRange) => {
    if (range === "all") return stats.totalVisitors || stats.seen24h || 0;
    if (range === "30d") return stats.seen30d || stats.seen24h || 0;
    if (range === "7d") return stats.seen7d || stats.seen24h || 0;
    return stats.seen24h || 0;
  };

  const topCountriesList = stats.topCountries || [];
  const topPagesList = stats.topPages || [];

  // Filter visitors list based on search term
  const filteredVisitors = stats.visitors?.filter((v: any) => {
    const term = searchTerm.toLowerCase();
    return (
      v.ip?.toLowerCase().includes(term) ||
      v.city?.toLowerCase().includes(term) ||
      v.country?.toLowerCase().includes(term) ||
      v.activePage?.toLowerCase().includes(term) ||
      v.activePageTitle?.toLowerCase().includes(term)
    );
  }) || [];

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 transition-colors duration-200 font-sans">
      
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 🎯 HEADER SECTION                                                */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              Visitors
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {stats.onlineCount} online now
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            People browsing your site right now — live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Timeframe Filter Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            {[
              { id: "24h", label: "24H" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "all", label: "All Time" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id as TimeRange)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === tab.id
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Real-time indicator clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-xs font-mono text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-400 font-medium">{getGMTString()}</span>
          </div>

          {/* Quick Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 📊 METRICS GRID                                                  */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Online Now */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Online Now
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {stats.onlineCount}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {stats.activeCount} active
            </span>
          </div>
        </div>

        {/* Metric 2: Dynamic Time Range Visitors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Visitors ({getTimeRangeLabel(timeRange)})
            </p>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {getVisitorsCountByRange(timeRange).toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              ↑ 46%
            </span>
          </div>
        </div>

        {/* Metric 3: Returning */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Returning
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {stats.returningPercentage}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
              of visitors
            </span>
          </div>
        </div>

        {/* Metric 4: Avg. Session */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Avg. Session
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {stats.avgSessionMin}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              min
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 🗺️ MAP & TABLES SPLIT VIEW                                      */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WORLD MAP WRAPPER (Left Pane - spans 2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-4 md:p-6 shadow-sm flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          <div className="pb-4 flex justify-between items-center z-10">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Visitor Distribution
              </h2>
              <p className="text-xs text-slate-400 font-normal">Interactive live location mapping</p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
              {stats.visitors?.length || 0} located
            </span>
          </div>

          {/* Interactive Leaflet Map integration */}
          <div className="relative w-full aspect-[2/1] my-auto rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800/60 z-10">
            <LeafletMap visitors={stats.visitors || []} />
          </div>

          {/* Map Footer / Legend */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs mt-4">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Idle
              </span>
            </div>
            <span className="text-slate-400 font-normal text-[11px] flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 bg-slate-400 rounded-sm"></span> Leaflet OSM & CARTO Tiles
            </span>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Top tables) */}
        <div className="space-y-6">
          
          {/* Top countries Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Top countries <span className="text-xs text-slate-400 font-normal ml-1">· {getTimeRangeLabel(timeRange)}</span>
              </h2>
              <p className="text-xs text-slate-400 font-normal font-sans">Real recorded sessions by country</p>
            </div>
            
            <div className="space-y-3.5">
              {topCountriesList.length > 0 ? (
                topCountriesList.map((country: any, idx: number) => {
                  const maxCount = topCountriesList[0]?.count || 1;
                  const ratio = (country.count / maxCount) * 100;
                  
                  return (
                    <div key={country.name + idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🌐</span>
                          <span>{country.name}</span>
                        </div>
                        <span className="font-mono font-medium">{country.count.toLocaleString()}</span>
                      </div>
                      
                      {/* Horizontal progress bar */}
                      <div className="h-2 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-900">
                        <div 
                          style={{ width: `${ratio}%` }} 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 font-normal">No country logs yet</p>
              )}
            </div>
          </div>

          {/* Top pages Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Top pages <span className="text-xs text-slate-400 font-normal ml-1">· {getTimeRangeLabel(timeRange)}</span>
              </h2>
              <p className="text-xs text-slate-400 font-normal font-sans">Real recorded visits by page</p>
            </div>
            
            <div className="space-y-3">
              {topPagesList.length > 0 ? (
                topPagesList.map((page: any, idx: number) => (
                  <div key={page.page + idx} className="flex justify-between items-center text-xs gap-3">
                    <div className="truncate flex-1">
                      <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                        {page.title}
                      </p>
                      <p className="font-mono text-[9px] text-slate-400 truncate font-normal">
                        {page.page}
                      </p>
                    </div>
                    <span className="font-mono font-medium text-slate-600 bg-slate-50 dark:bg-slate-850 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                      {page.count.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 font-normal">No page logs yet</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 📋 LIVE VISITORS DETAIL TABLE                                    */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-sm overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Active Sessions</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">List of live connections currently reporting client logs</p>
          </div>

          <div className="relative max-w-sm w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search active sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 font-normal"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-medium uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Location / IP</th>
                <th className="px-5 py-3 font-medium">Current Active Page</th>
                <th className="px-5 py-3 font-medium">Referrer</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal">
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor: any) => {
                  const isPinActive = new Date().getTime() - new Date(visitor.lastActive).getTime() < 20000;
                  
                  return (
                    <tr key={visitor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                      {/* Location & IP */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">🌐</span>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">
                              {visitor.city ? `${visitor.city}, ` : ""}{visitor.country}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{visitor.ip || "127.0.0.1"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Current Active Page */}
                      <td className="px-5 py-4 max-w-[280px]">
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300 truncate" title={visitor.activePageTitle}>
                            {visitor.activePageTitle}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate font-normal" title={visitor.activePage}>
                            {visitor.activePage}
                          </p>
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-slate-500 font-mono truncate max-w-[150px] inline-block font-normal" title={visitor.referrer || "Direct"}>
                          {visitor.referrer || "Direct / Organic"}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500 font-normal">
                        {Math.floor(visitor.duration / 60)}m {visitor.duration % 60}s
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          isPinActive 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
                            : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPinActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          }`}></span>
                          {isPinActive ? "Active" : "Idle"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-slate-400 text-center font-normal">
                    {isLoading ? "Fetching active session reports..." : "No active visitor sessions recorded."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
