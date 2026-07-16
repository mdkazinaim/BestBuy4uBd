import { useState, useEffect } from "react";
import { useGetVisitorStatsQuery } from "@/store/Api/VisitorApi";
import { 
  TrendingUp, 
  Clock, 
  Search,
  RefreshCw
} from "lucide-react";
import LeafletMap from "./Components/LeafletMap";

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real-time polling: refetch statistics every 5 seconds to match live dashboards
  const { data: statsData, isLoading, refetch, isFetching } = useGetVisitorStatsQuery(null, {
    pollingInterval: 5000,
  });

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
    returningPercentage: 0,
    avgSessionMin: 0,
    topCountries: [],
    topPages: [],
    visitors: []
  };

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
    <div className="space-y-6 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 🎯 HEADER SECTION                                                */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Visitors
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {stats.onlineCount} online now
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            People browsing your site right now — live.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Real-time indicator clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-xs font-mono text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-400 font-semibold">{getGMTString()}</span>
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
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Online Now
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.onlineCount}
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {stats.activeCount} active
            </span>
          </div>
        </div>

        {/* Metric 2: Seen 24H */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Seen 24H
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.seen24h}
            </span>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              ↑ 46%
            </span>
          </div>
        </div>

        {/* Metric 3: Returning */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Returning
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {stats.returningPercentage}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              of visitors today
            </span>
          </div>
        </div>

        {/* Metric 4: Avg. Session */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Avg. Session
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
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
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Visitor Distribution
              </h2>
              <p className="text-xs text-slate-400">Interactive live location mapping</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
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
            <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 bg-slate-400 rounded-sm"></span> Leaflet OSM & CARTO Tiles
            </span>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Top tables) */}
        <div className="space-y-6">
          
          {/* Top countries Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Top countries <span className="text-xs text-slate-400 font-normal ml-1">· live</span>
              </h2>
              <p className="text-xs text-slate-400">Total sessions mapped in 24h</p>
            </div>
            
            <div className="space-y-3.5">
              {stats.topCountries?.length > 0 ? (
                stats.topCountries.map((country: any, idx: number) => {
                  const maxCount = stats.topCountries[0]?.count || 1;
                  const ratio = (country.count / maxCount) * 100;
                  
                  return (
                    <div key={country.name + idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🌐</span>
                          <span>{country.name}</span>
                        </div>
                        <span className="font-mono">{country.count}</span>
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
                <p className="text-xs text-slate-400 text-center py-4">No country logs yet</p>
              )}
            </div>
          </div>

          {/* Top pages Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Top pages <span className="text-xs text-slate-400 font-normal ml-1">· live</span>
              </h2>
              <p className="text-xs text-slate-400">Most visited site directories</p>
            </div>
            
            <div className="space-y-3">
              {stats.topPages?.length > 0 ? (
                stats.topPages.map((page: any, idx: number) => (
                  <div key={page.page + idx} className="flex justify-between items-center text-xs gap-3">
                    <div className="truncate flex-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {page.title}
                      </p>
                      <p className="font-mono text-[9px] text-slate-400 truncate">
                        {page.page}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-500 bg-slate-50 dark:bg-slate-850 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                      {page.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No page logs yet</p>
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
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Active Sessions</h2>
            <p className="text-xs text-slate-400 mt-0.5">List of live connections currently reporting client logs</p>
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
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Location / IP</th>
                <th className="px-5 py-3">Current Active Page</th>
                <th className="px-5 py-3">Referrer</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor: any) => {
                  const isPinActive = new Date().getTime() - new Date(visitor.lastActive).getTime() < 20000;
                  
                  return (
                    <tr key={visitor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                      {/* Location & IP */}
                      <td className="px-5 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">🌐</span>
                          <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                              {visitor.city ? `${visitor.city}, ` : ""}{visitor.country}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{visitor.ip || "127.0.0.1"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Current Active Page */}
                      <td className="px-5 py-4.5 max-w-[280px]">
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-350 truncate" title={visitor.activePageTitle}>
                            {visitor.activePageTitle}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono truncate" title={visitor.activePage}>
                            {visitor.activePage}
                          </p>
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-5 py-4.5 whitespace-nowrap">
                        <span className="text-slate-500 font-mono truncate max-w-[150px] inline-block" title={visitor.referrer || "Direct"}>
                          {visitor.referrer || "Direct / Organic"}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4.5 whitespace-nowrap font-mono text-slate-500">
                        {Math.floor(visitor.duration / 60)}m {visitor.duration % 60}s
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4.5 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                  <td colSpan={5} className="px-5 py-12 text-slate-400 text-center">
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
