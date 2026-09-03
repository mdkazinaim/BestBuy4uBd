import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Eye,
  MousePointerClick,
  AlertTriangle,
  Settings,
  Activity,
  DollarSign,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  FileText,
  Search,
  ShoppingCart,
  Trash2,
  Download,
  Layers,
  BarChart3,
} from "lucide-react";
import { useGetAnalyticsDashboardQuery } from "@/store/Api/TrackingApi";
import { useGetVisitorStatsQuery } from "@/store/Api/VisitorApi";
import { websiteTrackingService, TrackedEvent } from "@/utils/websiteTrackingService";
import { Button } from "@/common/Components/Button";
import { motion } from "framer-motion";

type Mode = "website" | "google";

const MetricCard = ({ title, value, icon: Icon, colorClass, subtitle }: any) => (
  <Card className="shadow-none border border-slate-200 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
    <CardBody className="p-4 md:p-5 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4 shrink-0" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {subtitle && (
          <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
            {subtitle}
          </span>
        )}
      </div>
    </CardBody>
  </Card>
);

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Mode>("website");
  const { data: visitorStatsRes } = useGetVisitorStatsQuery(undefined);
  const totalVisitors = visitorStatsRes?.data?.totalVisitors || visitorStatsRes?.data?.seen24h || 0;

  // Internal Website Track state
  const [events, setEvents] = useState<TrackedEvent[]>(() => websiteTrackingService.getEvents());
  const [searchTerm, setSearchTerm] = useState("");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("all");

  // Fetch GA4 Analytics Data
  const { data: analyticsRes, isLoading: isGaLoading } = useGetAnalyticsDashboardQuery({});

  // Listen for real-time internal website events
  useEffect(() => {
    const handleEventLogged = () => {
      setEvents(websiteTrackingService.getEvents());
    };
    window.addEventListener("website_event_logged", handleEventLogged);
    return () => {
      window.removeEventListener("website_event_logged", handleEventLogged);
    };
  }, []);

  // Filter internal events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesCategory =
        eventCategoryFilter === "all" ||
        (eventCategoryFilter === "purchases" && evt.event === "purchase") ||
        (eventCategoryFilter === "cart" && (evt.event.includes("cart") || evt.event.includes("checkout"))) ||
        (eventCategoryFilter === "views" && (evt.event.includes("view") || evt.event.includes("select"))) ||
        (eventCategoryFilter === "search" && evt.event === "search") ||
        (eventCategoryFilter === "auth" && (evt.event === "login" || evt.event === "sign_up"));

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        evt.event.toLowerCase().includes(term) ||
        evt.path.toLowerCase().includes(term) ||
        evt.device.toLowerCase().includes(term) ||
        JSON.stringify(evt.payload).toLowerCase().includes(term) ||
        evt.user?.email?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [events, eventCategoryFilter, searchTerm]);

  // Aggregate internal metrics
  const internalMetrics = useMemo(() => {
    const totalInteractions = events.length;
    const purchases = events.filter((e) => e.event === "purchase");
    const totalRevenue = purchases.reduce((acc, p) => acc + (p.payload?.ecommerce?.value || p.payload?.value || 0), 0);
    const addToCarts = events.filter((e) => e.event === "add_to_cart").length;
    const searches = events.filter((e) => e.event === "search").length;

    return {
      totalInteractions,
      purchasesCount: purchases.length,
      totalRevenue,
      addToCarts,
      searches,
    };
  }, [events]);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all recorded internal website tracking logs?")) {
      websiteTrackingService.clearEvents();
      setEvents([]);
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `website_tracks_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatEventBadge = (eventName: string) => {
    switch (eventName) {
      case "purchase":
        return { label: "Purchase", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
      case "add_to_cart":
        return { label: "Add To Cart", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" };
      case "begin_checkout":
        return { label: "Begin Checkout", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" };
      case "search":
        return { label: "Search", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
      case "login":
        return { label: "Sign In", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
      case "sign_up":
        return { label: "Create Account", bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" };
      case "view_item":
        return { label: "View Product", bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700" };
      default:
        return { label: eventName.replace(/_/g, " "), bg: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700" };
    }
  };

  const renderPayloadDetails = (evt: TrackedEvent) => {
    const p = evt.payload;
    if (!p) return <span className="text-slate-400 text-xs font-normal">No details</span>;

    if (evt.event === "purchase") {
      const items = p.ecommerce?.items || [];
      const val = p.ecommerce?.value || p.value || 0;
      return (
        <div className="space-y-1 font-normal">
          <p className="font-medium text-emerald-600 dark:text-emerald-400 text-xs">
            Revenue: ৳{val.toLocaleString()} ({items.length} items)
          </p>
          {items.slice(0, 2).map((it: any, idx: number) => (
            <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-xs font-normal">
              • {it.item_name} (x{it.quantity || 1}) - ৳{it.price}
            </p>
          ))}
        </div>
      );
    }

    if (evt.event === "add_to_cart" || evt.event === "view_item") {
      const item = p.ecommerce?.items?.[0] || p;
      return (
        <div className="text-xs font-normal">
          <span className="font-medium text-slate-700 dark:text-slate-200">{item.item_name || item.name}</span>
          {item.price ? <span className="text-blue-600 dark:text-blue-400 font-mono ml-2 font-medium">৳{item.price}</span> : null}
          {item.item_category ? <span className="text-slate-400 text-[10px] ml-2">({item.item_category})</span> : null}
        </div>
      );
    }

    if (evt.event === "search") {
      return (
        <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
          Query: "{p.search_term}"
        </span>
      );
    }

    if (evt.event === "login" || evt.event === "sign_up") {
      return (
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          Method: {p.method || "Email/Password"}
        </span>
      );
    }

    return (
      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-xs block font-normal">
        {JSON.stringify(p).substring(0, 70)}
      </span>
    );
  };

  const GA_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
  const getDeviceIcon = (category: string) => {
    if (category.toLowerCase().includes("mobile")) return <Smartphone className="w-4 h-4 text-slate-400" />;
    if (category.toLowerCase().includes("tablet")) return <Tablet className="w-4 h-4 text-slate-400" />;
    return <Monitor className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Analytics & Interaction Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5 font-normal">
            Real-time user behavior, total site visitors, and Google Analytics tracking
          </p>
        </div>

        {/* Dual Mode Toggle Segment Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "website"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Track (Internal)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono font-medium">
              {events.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("google")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "google"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Google Analytics (GA4)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: WEBSITE TRACK (INTERNAL USER INTERACTION LOGS)        */}
      {/* ============================================================== */}
      {activeTab === "website" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Key Metrics Row (Using reusable Card component) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <MetricCard
              title="Total Site Visitors"
              value={totalVisitors.toLocaleString()}
              subtitle="Live total visitor counter"
              icon={Globe}
              colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              title="Tracked Interactions"
              value={internalMetrics.totalInteractions.toLocaleString()}
              subtitle="Captured user event logs"
              icon={Layers}
              colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <MetricCard
              title="Tracked Purchases"
              value={internalMetrics.purchasesCount.toLocaleString()}
              subtitle={`Total Revenue: ৳${internalMetrics.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            />
            <MetricCard
              title="Cart & Searches"
              value={`${internalMetrics.addToCarts} carts / ${internalMetrics.searches} searches`}
              subtitle="High intent user actions"
              icon={ShoppingCart}
              colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
          </div>

          {/* User Interaction Logs Table Card */}
          <Card className="shadow-none border border-slate-200 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden">
            <CardBody className="p-0">
              {/* Table Control Header */}
              <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Website Interaction Logs
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Detailed real-time log of actions performed by visitors on your website
                  </p>
                </div>

                {/* Action Buttons & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Event Category Filter Pills */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-lg text-xs">
                    {[
                      { id: "all", label: "All" },
                      { id: "purchases", label: "Purchases" },
                      { id: "cart", label: "Cart" },
                      { id: "search", label: "Search" },
                      { id: "auth", label: "Auth" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setEventCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          eventCategoryFilter === cat.id
                            ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xs"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 font-normal"
                    />
                  </div>

                  <Button variant="outline" size="sm" onClick={handleExportLogs} className="h-8 text-xs font-medium">
                    <Download className="w-3.5 h-3.5 mr-1 inline text-slate-400" /> Export JSON
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleClearLogs} className="h-8 text-xs font-medium text-rose-600 hover:text-rose-700">
                    <Trash2 className="w-3.5 h-3.5 mr-1 inline" /> Clear Logs
                  </Button>
                </div>
              </div>

              {/* Interaction Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-3 font-medium">Event Type</th>
                      <th className="px-5 py-3 font-medium">Details / Payload</th>
                      <th className="px-5 py-3 font-medium">Page Path</th>
                      <th className="px-5 py-3 font-medium">Device</th>
                      <th className="px-5 py-3 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-normal text-slate-700 dark:text-slate-300">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((evt) => {
                        const badge = formatEventBadge(evt.event);
                        const timeStr = new Date(evt.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        });
                        const dateStr = new Date(evt.timestamp).toLocaleDateString();

                        return (
                          <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            {/* Event Badge */}
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg}`}>
                                {badge.label}
                              </span>
                            </td>

                            {/* Payload Details */}
                            <td className="px-5 py-3.5 max-w-sm">
                              {renderPayloadDetails(evt)}
                            </td>

                            {/* Page Path */}
                            <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-500 font-normal">
                              {evt.path}
                            </td>

                            {/* Device */}
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-normal">
                                {getDeviceIcon(evt.device)}
                                {evt.device}
                              </span>
                            </td>

                            {/* Timestamp */}
                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 font-normal">
                              <div>
                                <p className="font-mono text-slate-700 dark:text-slate-300">{timeStr}</p>
                                <p className="text-[10px] text-slate-400">{dateStr}</p>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-normal">
                          No internal website interaction logs recorded yet. Interact with the store (Add to Cart, Search, Login) to generate live logs.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: GOOGLE ANALYTICS (GA4 INTEGRATION)                     */}
      {/* ============================================================== */}
      {activeTab === "google" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {isGaLoading ? (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center text-slate-500 animate-pulse font-normal">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading Google Analytics Data...
              </div>
            </div>
          ) : !analyticsRes?.success ? (
            <div className="w-full space-y-6 max-w-4xl mx-auto py-10">
              <Card className="shadow-none border border-amber-200 dark:border-amber-900/50 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 p-8 text-center flex flex-col items-center">
                <CardBody className="flex flex-col items-center p-0">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-4 rounded-full mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Google Analytics Not Configured</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mb-6 font-normal">
                    {analyticsRes?.message || "We couldn't connect to Google Analytics. Make sure you have uploaded the Service Account JSON and set your Property ID."}
                  </p>
                  <Button variant="primary" onClick={() => navigate("/admin/services")} className="font-medium">
                    <Settings className="w-4 h-4 mr-2 inline" /> Configure GA Service
                  </Button>
                </CardBody>
              </Card>
            </div>
          ) : (
            <>
              {/* GA Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <MetricCard
                  title="Active Users"
                  value={(analyticsRes.data.totals?.activeUsers || 0).toLocaleString()}
                  icon={Users}
                  colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />
                <MetricCard
                  title="Total Sessions"
                  value={(analyticsRes.data.totals?.sessions || 0).toLocaleString()}
                  icon={Activity}
                  colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                />
                <MetricCard
                  title="Total Page Views"
                  value={(analyticsRes.data.totals?.pageViews || 0).toLocaleString()}
                  icon={Eye}
                  colorClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                />
                <MetricCard
                  title="Avg Bounce Rate"
                  value={`${((analyticsRes.data.totals?.bounceRate || 0) * 100).toFixed(1)}%`}
                  icon={MousePointerClick}
                  colorClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
                />
                <MetricCard
                  title="Total Revenue"
                  value={`$${(analyticsRes.data.totals?.totalRevenue || 0).toFixed(2)}`}
                  icon={DollarSign}
                  colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                  title="GA Total Events"
                  value={(analyticsRes.data.totals?.eventCount || 0).toLocaleString()}
                  icon={MousePointerClick}
                  colorClass="bg-pink-500/10 text-pink-600 dark:text-pink-400"
                />
              </div>

              {/* GA Chart Card */}
              <Card className="shadow-none border border-slate-200 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900/60">
                <CardBody className="p-5 sm:p-6">
                  <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 mb-6">Traffic Overview (GA4)</h3>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsRes.data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                        <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* GA Devices & Countries Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-none border border-slate-200 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900/60">
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100">Top Pages</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-800/40 font-medium border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-4 py-3 font-medium">Page Title</th>
                            <th className="px-4 py-3 font-medium">Path</th>
                            <th className="px-4 py-3 font-medium text-right">Views</th>
                          </tr>
                        </thead>
                        <tbody className="font-normal">
                          {analyticsRes.data.topPages?.map((page: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{page.title || '(not set)'}</td>
                              <td className="px-4 py-3 text-slate-500 font-mono truncate max-w-[200px]">{page.path}</td>
                              <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">{page.views.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-none border border-slate-200 dark:border-slate-800/60 rounded-2xl bg-white dark:bg-slate-900/60">
                    <CardBody className="p-5 sm:p-6">
                      <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 mb-6">Devices</h3>
                      {analyticsRes.data.devices && analyticsRes.data.devices.length > 0 ? (
                        <div className="h-[200px] w-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={analyticsRes.data.devices} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="users" nameKey="category" stroke="none">
                                {analyticsRes.data.devices.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={GA_COLORS[index % GA_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : null}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
